Zdroj je čtení kompilovaného C v `main/` a `components/` a Dart v `flutter_czechmate/lib/`. Staré `.md` se jako důkaz nepoužily. Návrh v části B není stav firmwaru.

# Část A — co aktivní kód dělá dnes (2026-11-20)

## Obraz a verze

Firmware image je `esp32_chess_v24`, verze 1.8.0. Aplikace je `flutter_czechmate` 1.8.0+7, SDK `>=3.4.0 <4.0.0`.

## Transporty

Aktivní transporty jsou BLE GATT a Wi-Fi HTTP na portu 80 plus volitelný WebSocket `/ws`. Obě rádia zůstávají nahoře.

`transport_policy` příkazovou cestu nepřepíná. Gateuje boot Wi-Fi (`transport_policy_should_enable_wifi_on_boot`: NVS `wifi_config/sta_ssid` nebo `ap_user_en`), jednorázový `esp_wifi_start`, při BLE connect žádá interval 7,5–15 ms a `ESP_COEX_PREFER_BT`, při disconnect `ESP_COEX_PREFER_WIFI`. `transport_policy_init` a helpery wifi failover logu nemají volající.

UART je lokální konzole. Na startu se suspenduje a potom obnoví.

MQTT (`ha_light_task`) je lampa Home Assistant plus hrubý JSON herní aktivity `state/reason/result/mode`. Šachový snapshot to není. Broker je v NVS namespace `mqtt_config`. Chybějící NVS defaultuje na `homeassistant.local:1883`, uživatel `alfred`. Publish je QoS 0, last-will QoS 1. Stejný STA netif `WIFI_STA_DEF`.

## NVS

`config_manager`, namespace `chess_config`, ukládá UI, log, jas a snapshoty (`g_snap_*`). `ui_prefs_v1` má strop 3072. Wi-Fi, MQTT, pairing ani session epoch tam nejsou.

Ty leží v `wifi_config`, `mqtt_config`, `web_config` (`api_tok` 32 B, locked) a `pair_slots` (bloby 44 B, `pseq`). Epoch je RAM v `cmd_wire.c`.

## BLE

Služba `A0B40001-9267-4AB6-BDCC-E8336F8A8D9E`.

- snapshot `…0002` READ|NOTIFY
- command `…0003` WRITE (ne WRITE_NR)
- network `…0004` READ|NOTIFY
- cmd_ack `…0005` NOTIFY

Jméno zařízení je `CZECHMATE`. Advertising manufacturer `0x02E5`, magic `0xC2`, bit0 je pairing window, bit1 je connected. Advertising intervaly jsou ponechané. SMP je Just Works, bonding zapnutý, SC zapnutý, MITM vypnutý. Druhé spojení se zahodí. Neznámý peer mimo okno 60 s se zahodí.

## Rámec snapshotu, příkazů a OTA chunků

Snapshot notify: bajty `0x43 0x4D`, part u8, total u8 (číslování od 1), potom JSON. Snapshot READ, WebSocket a HTTP GET `/api/game/snapshot` jsou surové JSON. Checksum není. `state_version` je monotónní a přeskakuje 0. ETag / If-None-Match / 304 jsou v cestě. Příkazy jsou JSON.

OTA chunky: `0x4F 0x42`, uint16 LE index, uint16 LE total, payload. CRC není. Úspěšný chunk notify neposílá.

## WebSocket `/ws`

Strop rámce je 256 B. Příkaz se bere jen tehdy, když frame obsahuje `from` nebo `cmd`. Přijatý je jen tah (`from`+`to`). Jinak `unknown_command`. Token jde přes `?token=` nebo pole `token`. Anonymní klient smí poslouchat snapshoty. Druhý token snapshoty dostane, na tah dostane `board_busy`. Ping/pong na WS není. Časovač 3 s zařadí plný snapshot pro WS, a tím i pro BLE.

## Potvrzení a časy čekání

BLE ack `ok` znamená zařazeno do `game_submit`, ne že se tah už aplikoval. Kódy: `ok`, `unknown_command`, `missing_cmd`, `invalid_argument`, `blocked`, `tutorial_finish_conflict`, `internal_error`, `busy`, `stale`, `error`, `paired`, `not_pairing`. Ack `id` se vrací z nenulového `req`, jinak z nenulového `id`, a nikdy není 0. Flutter waiter klíčuje na `req` a čte jen `id`. HTTP přijme tělo bez `id`.

BLE čeká 900 ms. Timeout HTTP klienta je 35 s. Tah přes HTTP/WS čeká až 1 s a může vrátit illegal nebo `Move processed`. Timeout je pořád úspěch `Move queued`.

## Session epoch

Příkazy jsou `session_claim` a `session_release`. Neshoda epochy je `stale`. Výjimky: `ping`, `wifi_survey`, `ota_ble_status`, `pair_token`, `session_claim`, `session_release`. Když žádná session neběží, příkazy pokračují.

Šifrování je povinné pro `ota_*`, `wifi_survey`, `wifi_sta_config`, `wifi_sta_ip_block`, `wifi_ap_set`, `factory_reset` a OB chunky. Herní příkazy šifrováním gateované nejsou. Flutter udělá `beginEpoch` a claim nespouští s await. Selhání se jen zaloguje.

## Fronty, heap a stacky

`game_command_queue` má hloubku 24, timeout `game_submit` je 100 ms. `snapshot_notify_queue` má hloubku 2, timeout odeslání 0 a fronta se slévá. Web sender drží snapshoty 250 ms od sebe (`web_server_process_snapshot_notify_queue`). Pod 12 KiB heapu se snapshot přeskočí, busy práh je slab 20 KiB. `game_get_status_json` bere `game_mutex` až 1000 ms. Stack `GAME_TASK` je 6 KiB, stack `WEB_SERVER` je 20 KiB, httpd má 8192.

## Hall, error_state a bump

Hall je zapnutý (`CONFIG_CHESS_MATRIX_INPUT_I2C_HALL=y`). Cesta je `squares_task` → `GCMD_BOARD_LIFT` / `DROP` / `GUARD` → `game_hall_position`.

Lift nastaví `piece_lifted` a bump neudělá. Stejný drop lift smaže, taky bez bump. Nelegální Hall `error_state` nenastaví (RESTORE / chaos). `error_state` je západka reed/app/UART (`waiting_for_move_correction`, `invalid_pos`, `original_pos`, `error_count`) a ani ty cesty bump neudělají. Úspěšný `commit_legal` bump udělá. Undo bump udělá. Guard clear bump udělá. Timeout hodin a rezignace nastaví `FINISHED` a v seznamu bumpů nebyly.

Potvrzení liftu jsou 2 skeny × 25 ms (~50 ms), teprve potom příkaz existuje. Položení čeká `HALL_STABLE_MS` 250. `game_task` přijímá až 25 ms. Kdyby se bump přidal, lift-to-ping je asi 50–75 ms a položení asi 250–275 ms. 20 ms dosažitelné není.

## `game_state`

Enum: `IDLE`, `INIT` (nikdy), `ACTIVE` (živá hra, na drátu `active`), `PAUSED` (nikdy přiřazeno), `FINISHED`, `ERROR` (nikdy), `PLAYING` (nikdy přiřazeno, jen serializer), `PROMOTION` (na drátu `promotion`), `ERROR_RECOVERY` (nikdy), `WAITING_FOR_RETURN` (serializace `active`), `WAITING_FOR_BOARD_SETUP` (serializace `idle`).

Stockfish ani Lichess v `components/` nejsou. Enginy jsou na telefonu.

## Pole snapshotu, která aplikace parsuje

- `board`: řádek 0 na drátu je řada 1. Aplikace řádky otočí, když je index řady bílého krále menší než index řady černého krále.
- `history`: `from`, `to`, `piece`, `timestamp`. Firmware san nedává a písmeno promoci taky ne. `piece` je táhnoucí kámen.
- seznamy sebraných kamenů
- hodiny v ms
- důvody `game_end`: varianty matu, rezignace, timeout, pat, pravidlo 50 tahů, opakování, nedostatečný materiál, dohoda
- `piece_lifted` se parsuje, žádný widget ho nečte
- `castling_in_progress` se uloží, žádný widget ho nečte
- `error_state`
- `puzzle`, `opening_training`
- `matrix_occupied` jen v tutorialu, puzzle a opening
- masky matrix guard

`fenFromSnapshot` rošádu hádá, en passant vynutí na `-` a hodiny na `0 1`.

## Flutter shell

Živý shell má tři taby: `GameScreen`, `TrainScreen` (`learn_hub`), `SettingsScreen`. Router není.

Stockfish jde přes chess-api.com, stockfish.online a lichess cloud-eval, potom LED nápověda přes `postHintMove`. Lichess je denní puzzle GET a cloud-eval. Watch umí jen pause/resume. Coach je cloud LLM, čte FEN a na desku POST neposílá.

## Přímé volání `BoardApiClient`

Tyto cesty jdou mimo `BoardSessionNotifier`: `postPair`, vývojářské `postWiFiConfig` / `Disconnect` / `Clear`, ruční disconnect/clear, `postMQTTConfig`, `postBoardUISettings`, `postDemoConfig` / `Start`, `postLedGuidanceLevel`, `postGuidedCaptureHints`, `postFactoryReset`. `BleCzechmateClient` se konstruuje jen uvnitř notifieru.

## Příkazy sestavené, z UI nevolané

Z UI se nevolá BLE undo, promotion, `timer_reset`, HTTP `virtual_action` a BLE buildery pro LED guidance a guided hints. `light_pattern` Flutter posílá. Řetězec `light_pattern` pod `components/` není. `web_routes` má jen `/api/light/command` a `/api/light/game_mode`.

## LED, `chess_core` a tasky, které nejedou

Kontrakt, který hra používá: `game_led_frame_begin` / `sq` / `breathe` / `end` / `flush`. `led_state_*` se z game, web ani ble nevolá. `chess_core` je `position_reset` / `from_fen` / `to_fen` / `legal` / `apply` / `undo` / `status` a volá ho jen `game_task`. FreeRTOS event groups na této cestě nejsou. `squares_event_queue` nemá živého konzumenta. Animation task a `test_task` se nestartují.

## OTA, jak běží dnes

`ota_guard` má journal a `PENDING_VERIFY` (stabilita 30 s, deadline 180 s, crash-loop 3, `CONFIG_APP_ROLLBACK_ENABLE`). `schedule_ota`: schéma `https://` vybere TLS worker a vyžaduje STA; schéma `http://` vybere HTTP worker a subnet netestuje. Telefon už servíruje `http://ip:port/czechmate_ota.bin`. BLE má OB stream a suspend 24 h. Flutter iOS má strop OTA payloadu 236 a mezeru 55 ms, Android má strop 500. Manifest je `https://raw.githubusercontent.com/alfredkrutina/CzechMate/main/firmware/version.json`.

## Platformy a mDNS

iOS `createBond` nevolá, úvodní čtení snapshotu přeskakuje a `ensureGattReadyForCommands` snapshot notify neobnoví. `refreshNow` pořád volá `readSnapshot` s 28 s. Android volá `createBond` jen uvnitř `prepareEncryptedBleLink`. `autoConnect` není. Windows, web a Fuchsia BLE nemají. Balíček mDNS v aplikaci není. Uložený reconnect bere `czechmate.lastMdnsHost` jako `http://host.local`. mDNS na desce je `czechmate-` plus bajty 3–5 MAC adresy, služba `_http._tcp`, port 80.

## Wi-Fi

Výchozí režim je STA. APSTA jen při `ap_user_en`. Základ SSID AP je `ESP32-CzechMate`, heslo je literál `12345678`, kanál 1, nejvýše 10 stanic, adresa `192.168.4.1/24`. Reconnect začíná na 3 s a zdvojnásobuje se až na 30 s. Přihlašovací údaje jdou přes `wifi_sta_config` nebo POST `/api/wifi/config` a v NVS jsou `sta_ssid` / `sta_password`.

## Obrazovky, na které nic neroutuje

Třída existuje, cesta na ni nevede: `learn/learn_screen.dart`, `progress/progress_screen.dart`, `setup/setup_screen.dart`, `settings_modules_page`, `settings_language_page`, `settings_overview_page`, `settings_app_appearance_page`. Koncovky jsou téma puzzle, ne trenér. Vývojářské UI je sedm klepnutí na titulek Settings.

# Část B — návrh, který se ještě neimplementuje

Každá sekce níže je návrh. Ve firmwaru ani v aplikaci to dnes není.

## NÁVRH — `board_state` vedle `game_state`

Ve vlně 1 se `game_state` nepřejmenovává. Vedle něj přibude `board_state`:

- `playing` z `ACTIVE`, včetně čekání na vrácení kamene
- `setup_required` z `WAITING_FOR_BOARD_SETUP`, nebo z puzzle `setup_active`, nebo z opening `setup_phase`
- `tutorial` z aktivního puzzle, opening nebo `board_setup_tutorial`
- `error_recovery` ze západky, enum se nemění
- `promotion_pending` z `PROMOTION`
- `paused` z pauzy časovače, ne z `GAME_STATE_PAUSED`
- `finished` z `FINISHED`
- `idle` z `IDLE`

Lampa zůstane overlay `light_mode` / `light_state`. Do `board_state` nepatří, jinak by schovala běžící hru.

## NÁVRH — `error_state.piece` a `guide`

Přidat `error_state.piece` z `piece_type`. Přidat `guide` s poli `kind`, `from`, `to`, `zone`. `from` a `to` lze naplnit z existujících `expected_from` / `expected_to`. `zone` dnes neexistuje. Legální cílová pole se na drátě nepředstírají.

## NÁVRH — vlna `tutorial_step`

Parsovat na `GCMD_WEB_HINT` jen tehdy, když jsou puzzle, opening i `board_setup_tutorial` vypnuté. Jinak error ack. V té vlně nové rameno `game_cmd` nepřibude. Existující příkazy režimů zůstávají. Pozdější helper `game_led_guide_squares` v `game_led_direct.c` je jen smyčka `game_led_frame_sq` uvnitř otevřeného framu. `squares_task` ani `led_task` se v té vlně nesahají.

## NÁVRH — snapshot hned po změně na desce

Jeden bump na konci `game_hall_position_service`, pokud ten průchod nastavil dirty bit: lift se ukázal, lift se smazal, RESTORE, neúspěšný commit, vstup do chaosu. K tomu díry `FINISHED` v časovači a v rezignaci. Uvnitř každého classify scanu se bump nevolá. Na webu se 250 ms prodleva přeskočí, když se změnila revize. Třísekundový watchdog pro tichou desku zůstává. JSON se na game tasku nestaví. Reálná podlaha po té změně: lift asi 50–175 ms do vzduchu, položení asi 250–350 ms, plus čas JSON a BLE chunků. 20 ms to není.

## NÁVRH — jeden aktivní transport v aplikaci

Stavy:

- `BleRealtime`: BLE aplikuje snapshoty, příkazy jdou GATT
- `LanReady`: pořád BLE, dokud `/ws` nedodá jeden snapshot
- `WifiData`: jen `/ws`, HTTP poll stojí, příkazy jdou socketem
- `WifiSilent`: drží se poslední snapshot, `new_game` se neposílá
- `BleFallback`: `session_claim` s transportem ble, potom GATT

Heartbeat je existující snapshot á 3 s. Tři zmeškané snapshoty a mrtvý socket znamenají fallback. `session_claim` se awaituje. Fallback nesmí poslat `new_game`. IP se bere z network charakteristiky. `/ws` se otevírá až po úspěšném GET snapshotu na té base URL.

## NÁVRH — jedna JSON obálka pro GATT a `/ws`

Pole: `cmd`, `req`, `id` echo z `req`, `epoch`. `transport` má smysl jen u `session_claim`. Ack je `{id, channel:cmd_ack, ok, code, cmd}`. Strop WS rámce se zvedne z 256 na 768. Vstup WS nesmí brát SMP encryption gate. `ok` zůstává ve významu queued. Sada, na kterou mají WS příkazy dorůst, je dnešní BLE sada: hra, nastavení, `mqtt_config`, LED guidance, `wifi_*`, OTA JSON, session. OB chunky zůstávají na GATT. GET snapshotu a GET `/api/system/firmware` zůstávají HTTP. `light_pattern` parita není, dokud neexistuje handler.

## NÁVRH — OTA

`http://` povolit jen pro `192.168.4.0/24`, když je AP nahoře, nebo pro STA IPv4 /24, když je STA připojená. `https://` zůstává cesta do internetu. Volitelný CRC32, 4 B little-endian, leží až za OB payloadem a zapíná ho `ota_ble_begin` s `"crc":true`. Staří zapisovači drží payload = len−6. CRC do šestibajtové hlavičky nepatří. Druhý OTA task se nepřidává.

## NÁVRH — odvozené UI

`BoardUiState` je odvozený typ aplikace, ne enum firmwaru. Kanál smí obsahovat `reconnecting` jen jako stav aplikace. `BoardPainterInput` je jediný typ, který má budoucí pohled 2,5D/3D brát: `cells`, `flipped`, `coordinates`, `marks`, zvednuté pole, `animate`. Mapa obrazovky: pill (kanál + fáze) a dnešní tři sekce Play / Train / Device. Discovery, Wi-Fi provision, čas nové hry, promoce, analýza a potvrzení factory resetu jsou sheety nebo pushed stránky, ne čtvrtý tab. Mrtvé obrazovky se neoživují.

## NÁVRH — forget-board

Forget-board dnes neexistuje. Až se postaví, smaže `czechmate.lastBleRemoteId`, `boardCommandToken`, `boardApiToken`, `boardBaseURL`, `lastMdnsHost`, `lastBLEDeviceDisplayName` a `lastBoardLinkKind`. `removeBond` v kódu není. OS unbond je mimo tuto vlnu.

## NÁVRH — vlny a soubory

1. `game_hall_position.c`, `game_policy.c`, `game_timer.c`, `game_resignation.c`, `web_server_task.c` (přeskočení 250 ms).
2. Jen `game_json_export.c` (`board_state` a `error_state.piece`).
3. `web_ws.c`, `cmd_wire.c`, v `web_server_task.c` SMP bypass pro WS, parser příkazů namapuje `tutorial_step` na `GCMD_WEB_HINT`. Příjemce v `game_dispatch.c` už je. `game_led_direct.c`: `game_process_web_hint` udělá reply a bump. `GCMD_MODE_PUZZLE` / `OPENING` / `TUTORIAL` se nemění.
4. `board_session_notifier.dart` jako jediný applier, `web_socket_manager.dart` send a ack, `board_command_port.dart` Wi-Fi příkazy na socketu, `ble_czechmate_client.dart` obnoví snapshot notify. `connection_orchestrator.dart` jen tehdy, když se notifier rozdělí. `transport_policy.c` zůstává politika rádií.
5. `ota_update.c`: subnet a volitelný CRC. `firmware_phone_host_ota.dart` drží URL `http://`. Trailer v `uploadFirmwareBle`.
6. Nové soubory Flutteru: `features/board_ui/board_ui_state.dart`, `board_ui_mapper.dart`, `features/shell/status_pill.dart`, `app_shell.dart`, `features/game/board/board_view.dart`. Zeštíhlit `game_screen.dart`, `chess_board_widget.dart`, `game_ui_notifier.dart` a `main.dart`. Obcházející POST schovat za notifier dřív, než se změní typ snapshotu. `game_led_guide_squares` patří do této vlny.

Až aplikace čte `board_state`: přiřadit `GAME_STATE_PAUSED` z `game_pause_timer` a přestat pro setup emitovat `idle`. UX forget-board patří do `settings_connection_page.dart` a `prefs_repository.dart`.

## Co se nesmí splést

- 20 ms není podlaha senzoru.
- HTTP OTA se už přijímá.
- `playing` není živý řetězec `game_state`.
- WebSocket dnes nemá paritu příkazů s BLE.
- Lampa není stav hry.
