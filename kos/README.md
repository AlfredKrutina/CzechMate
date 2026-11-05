# kos/ — staré a nepoužívané zdroje

Tato složka obsahuje zdroje, které nejsou potřeba pro Hall V2 build, ale zůstávají uloženy, aby se daly v případě potřeby vrátit zpět. **Toto je finální přehledná dokumentace, ne pracovní koncept.**

## kos/v1-reed/ — stará cesta s reed maticí (V1)

Živý build je jen Hall. Reed sken, init řádků a sloupců a fyzická promoční tlačítka jsou z `components/` pryč. Kopie souborů z doby před vystřižením leží v `firmware/` a do CMake se nelinkují.

- `hardware/v1-reed-matrix/README.md` — specifikace a zapojení V1 desky.
- `firmware/` — původní znění souborů, ve kterých byla reed větev.

V2 dál používá jedno gesto tlačítko (`button_gesture.c`, GPIO23 když je `CONFIG_CHESS_GESTURE_BUTTON`). Čtyři promoční tlačítka na sloupcích matice a reset na GPIO15 živý sken nečte. GPIO15 je na Hall desce NRST STM32.

## kos/unused/ — opravdu nepoužívané komponenty a skripty

Následující soubory byly v repozitáři označeny jako nepoužívané (orphan / legacy / not linked) a žádný živý build je nevolá. Přesunuty sem pro případnou pozdější archivaci nebo návrat.

- `components/animation_task/` — legacy animační task. Vytváření tasku je zakomentováno v `main/main.c`; animace se řídí z `led_task` a `unified_animation_manager`. Fronty `animation_command_queue` a `animation_status_queue` zůstávají vytvořeny v `freertos_chess.c`, protože na ně kontroluje `main.c` a `uart_handlers_debug.c`.
- `components/enhanced_castling_system/` — není linkováno z `game_task` ani z hlavního `CMakeLists.txt` (`EXTRA_COMPONENT_DIRS`).
- `components/promotion_button_task/` — orphan task. Živá promoce na Hall desce je z typu figurky a z aplikace, ne ze čtyř fyzických tlačítek.
- `components/reset_button_task/` — orphan task. V2 má jedno gesto tlačítko v `button_task`.
- `delete_dead_castling.sh` a `scripts/maintenance/delete_dead_castling.sh` — deprecated skripty, jejichž jediným účelem bylo smazání `enhanced_castling_system`.

## Co zůstalo v živém stromu

- `components/squares_task/` — Hall I2C (`hall_i2c_squares.c` a smyčka v `squares_task.c`). Reed multiplex v tom souboru už není.
- `components/freertos_chess/freertos_chess.c` — fronty, mutexy, LED a status GPIO. Reed řádky a sloupce se neinicializují.
- `components/button_task/` — gesto tlačítko V2. Fyzický sken čtyř promočních tlačítek a GPIO15 resetu je v archivu.
- `components/game_task/`, LED, web, BLE, MQTT, animace a OTA zůstávají, protože je Hall deska používá.
- `components/test_task/` zůstává a je volitelný přes menuconfig.

## Mrtvé herní handlery (2026-10-26)

Přesunuto z živého `game_task`, protože v celém stromu neměly volajícího. Firmware je nelinkuje.

- `unused/components/game_task/matrix_event_handlers.c` — `game_detect_new_game_setup`, `game_handle_piece_lifted`, `game_handle_piece_placed`, `game_handle_squares_move`, `game_highlight_opponent_pieces`. Tahy z matice jdou přes `GAME_CMD_PICKUP` / `GAME_CMD_DROP`.
- `unused/components/game_task/board_print_and_squares_events.c` — prázdné `game_process_squares_events` a `game_print_board_enhanced` bez volání.
- `unused/components/game_task/dead_highlight_skip.c` — větev `else` po `total_games++`, která se nespustila, protože čítač je v tu chvíli nejméně 1.

V souboru zůstalo a je živé: promoce, `game_execute_promotion`, `game_highlight_movable_pieces`, `game_is_castling_expected` (volá `game_physical.c`).

## Prohlížečové UI (2026-10-11)

Do `kos/unused/web_ui/` šla lidská šachová stránka: `web/` (JS moduly, `chess_app.js`, katalog zahájení, PNG figurek), `chess_piece_http.c` s hlavičkou a skripty, které JS a PNG balily do firmwaru. Živý `web_server_task` dál servíruje WiFi, REST `/api/*`, WebSocket `/ws` a OTA pro Flutter a desktop. `GET /` vrací JSON pro aplikaci, `GET /chess_app.js` vrací 404. Volba `CHESS_ENABLE_EMBEDDED_WEB_UI` v Kconfig už není.
