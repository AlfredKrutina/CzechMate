# Rozpoznání figur na Hall V2 — 23. října 2026

Na fyzické desce to po flashi z 23. října 2026 funguje poměrně dobře. Zdroj pravdy ve firmwaru je `components/squares_task/hall_i2c_squares.c`. Tady je stav, ke kterému se došlo měřením na skutečných figurkách, a co dalšího se ve stejné práci změnilo.

Každá figurka má jeden diskový magnet. Barva je polarita, typ je síla a šířka. Bílý král a černá dáma v sadě zatím nejsou. Stejný magnet otočený o polaritu je druhá barva, ne jiný typ. Znaménko se na typ nesmí použít.

| Figurka | Magnet | Simulovaný Bz v ose |
| --- | --- | --- |
| Pěšec | Ø10×1 N42 | 7,9 mT |
| Jezdec | Ø10×2 N42 | 14,3 mT |
| Střelec | Ø10×3 N42 | 19,6 mT |
| Věž | Ø10×5 N38 | 26,3 mT |
| Dáma | Ø10×8 N42 | 35,5 mT |
| Král | Ø12×6 N42 | 40,8 mT |

Senzory DRV5055A1 jsou 11,2 mm pod čelem magnetu, pár má rozteč 6,267 mm a každý je 3,13 mm mimo osu pole. Převod v dokumentaci simulace je 81,92 countů na mT. Věž nemá odečet energie z desky. Její pásmo je jen mezera, do které nesmí spadnout střelec ani nejslabší dáma.

## Jak se počítá pole

Energie `E = dev0² + dev1²`. Odchylka je filtrovaný ADC minus nula prázdného pole (`ctx_ref`, jinak `midpoint`). Barva je znaménko silnější odchylky: kladná bílá, záporná černá. Ustálení typu trvá 250 ms a připouští asi 4 % změnu (`HALL_STABLE_REL_DIV` 25). Sken polí je 25 ms.

Obsazení ve firmwaru nepoužívá součet odchylek 270/160. Pole se zveřejní jako obsazené, když energie drží aspoň `HALL_REOCCUPY_ENERGY` (18000) po `HALL_REOCCUPY_SCANS` (4) skeny. Zvednutí jde ven po `HALL_LIFT_CONFIRM_SCANS` (2) prázdných skenech. `HALL_POC_ENERGY_DEADBAND` je 10000 a v klasifikaci se používá. `HALL_POC_DELTA_ON` (270), `HALL_POC_DELTA_OFF` (160) a `HALL_POC_ENERGY_ON` (25000) v souboru zůstaly a nikdo je nečte.

Řádek `>>> POC sq` ve firmwaru není. UART `HALL BOARD` tiskne typ, barvu, obsazení, energii, dev0 a dev1.

## Pásma energie

Pásma v `s_poc_thresholds` na sebe navazují. Podlaha pěšce je 10000, protože pěšec na výchozí řadě padal pod starou podlahu 71610. Strop věže je 2511729; starý strop 1724251 pojmenovával věž jako dámu. Dáma začíná na 2511730. Král vlastní pásmo nemá.

| Typ | Energie od | Energie do |
| --- | ---: | ---: |
| Pěšec | 10000 | 250080 |
| Jezdec | 250081 | 613704 |
| Střelec | 613705 | 1380458 |
| Věž | 1380459 | 2511729 |
| Dáma | 2511730 | 7500000 |

Měření z 23. října, ze kterého ta pásma vznikla: nejslabší pěšec 77837, jezdci 421057 až 577792, střelci 651850 až 1242413. Věž se ten den neměřila.

Hrana jezdec/střelec je `round(sqrt(577792 × 651850))` = 613705. Ocas střelce 489376 a log 547885 jsou schválně v pásmu jezdce. Střelec 1107410 a 1242413 zůstává střelec, ne věž. Nominály pro zisk pole: pěšec 120000, jezdec 484445, střelec 787792.

Jedna energie dámu a krále neoddělí. Dáma v klidu: 2511730, 3117593, 3691172, 3837860. Stejná dáma při posunu po desce: 2745865 až 4544912, špičky 3991914, 4002925, 4027777, 4034242, 4241225. Král v klidu: 3403621, 4568597, 4611613, 4883125, 5378533, 5443562, 5651540. Posun hranice nad 4,54 milionu z dámy udělal krále na 4,57 a 4,61 milionu. Proto v tabulce královské pásmo není.

## Dáma a král

Král je širší disk (12 mm proti 10 mm), takže slabší senzor zůstává silnější. Rozhoduje součin absolutních odchylek, funkce `hall_name_royal`.

Součiny klidných odečtů:

| Figurka | Energie | Odchylky | Součin |
| --- | ---: | --- | ---: |
| Dáma | 2511730 | 973, 1251 | 1217223 |
| Dáma | 3691172 | 784, 1754 | 1375136 |
| Dáma | 3837860 | 848, 1766 | 1497568 |
| Dáma | 3117593 | 1072, 1403 | 1504016 |
| Král | 3403621 | 1314, 1295 | 1701630 |
| Král | 4611613 | 997, 1902 | 1896294 |
| Král | 4568597 | 1111, 1826 | 2028686 |
| Král | 5443562 | 1811, 1471 | 2663981 |

Král je součin aspoň **2600000**, nebo od **1930000**, když se senzory liší aspoň o 18 % (poměr pod 0,82). Čtyři odečty dámy mají součiny 1834222, 1851795, 1855701 a 2545062. Ta nejsilnější (1461 a 1742, poměr 0,84) zůstává dáma, protože senzory jsou vyrovnané a součin je pod 2600000. Středový král se bere od součinu **1500000**, když je slabší senzor aspoň 1100 a oba jsou do 14 %. Osm králů z večerního odečtu: 1027/1905, 1396/1430, 1151/1325, 1297/1467, 1270/1352 a 1326/1905 jsou král. 655/1794 a 779/1713 zůstávají dáma, leží na odečtu dámy 784/1754.

Než se na obsazeném poli přepne dáma na krále nebo zpět, musí nové čtení vydržet tři ustálení, asi 0,75 s (`HALL_ROYAL_SWITCH_SCANS`). První jméno po položení padne hned po běžném ustálení. Zámek „jednou král, navždy král“ se neosvědčil: první špička při najetí na pole držela špatný typ i potom, co se figurka usadila.

Když dáma sedí přesně uprostřed a oba senzory jsou do 14 %, součin od 1500000 z ní udělá krále. Dáma 963/1927 (součin 1855701) je těsně pod čarou 1930000. Král 997/1902 (součin 1896294) a král 972/1754 jsou pořád na její straně.

Krátký „Rook“ kolem 1,4 milionu při najíždění dámy je energie, která ještě nedosáhla královského pásma. Není to změřená věž.

## Podsvícení přípravy

Světlo domácího pole zhasne jen tehdy, když senzor pozná tu správnou figurku, typ i barvu. Samotné obsazení nestačí. Dáma a král stejné barvy se na královském domácím poli berou jako shoda. Dva bílé pěšce senzor nerozezná, takže bílý pěšec na cizím bílém pěšci světlo zhasne.

Řady 3 až 6 na polích, která motor považuje za prázdná, svítí barvou typu ze senzoru, včetně dámy a krále. Po boot animaci se průvodce jednou znovu nakreslí i ve stavu `GAME_STATE_IDLE`, takže deska s už položenými figurkami po startu nesvítí prázdná. Správná domácí pole zůstávají tmavá.

## Ruka s víc figurkami

Fáze 2b je ve zdroji: nejvýš čtyři figurky ve vzduchu, pořadí zvednutí, hromádka branek. Položení se skóruje návratem na původní pole, legálním tahem, shodou typu z Hallu a vzdáleností. Když se dvě legální skóre liší nejvýš o 10 a ani jedno není vrácení, obě výchozí pole bliknou a zahraje se vyšší skóre. Každý tah se o 0,5 s nezdržuje. Král do zkratky „druhá figurka v ruce“ nevstupuje. Rošáda a braní mimochodem rukou neprocházejí.

## Zisk pole

První krok fáze 3 je v RAM a po restartu zmizí. Na pole se učí jen pěšec, jezdec a střelec, po potvrzeném položení, čtyřech vzorcích, v rozsahu 0,75 až 1,33 nominálu. Zisk se drží mezi 0,85 a 1,15. Dáma, král a věž se neučí. Dokud pole nemá čtyři vzorky, klasifikace bere surovou energii.

## STM32 při startu

ROM bootloader na adrese `0x63` při GET_ID neodpovídá. ESP-IDF z toho udělá `ESP_ERR_INVALID_STATE`, ne tvrdou chybu Hallu. Firmware to bere jako NACK, zapíše varování, pustí STM32 zpět do aplikace a ověří, že segmenty Hall odpovídají. Obraz z partition `stm32_fw` se při tom nezapíše. Každý start pořád zkusí reset všech čtyř STM32, protože v NVS není úspěšný CRC zápisu.

## Co schválně není hotové

Naučená pásma typů, model přeslechu, obnova celé desky po výpadku napájení a tichá kontrola jen přítomnosti. Trvalý zisk polí v NVS. Měření věže. Zkrácení ustálení pro rychlé položení. Přeskočení pokusu o bootloader, když Hall už odpovídá.
