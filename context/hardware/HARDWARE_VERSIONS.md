# CzechMate hardware versions (V1 vs V2)

The live firmware in this repo is **1.8.0** and it senses the board with **Hall** pairs over I2C (`components/squares_task/hall_i2c_squares.c`). Reed is not a build option. Its sources and the old board note are in [../../kos/v1-reed](../../kos/v1-reed).

Hardware notes:
- **V1 reed board (archived):** [../../kos/v1-reed/hardware/v1-reed-matrix/README.md](../../kos/v1-reed/hardware/v1-reed-matrix/README.md)
- **V2 Hall + STM32:** [WIRING_ESP_STM4.md](WIRING_ESP_STM4.md) and [rozpoznani-figur-2026-10-23.md](../firmware/rozpoznani-figur-2026-10-23.md). A file `hardware/v2-hall-stm32/README.md` is not in the repo.

| | **V1 reed (archived)** | **What the firmware does now** |
|---|--------------------------------------|-------------------------------------|
| **Piece detection** | 8×8 reed — occupied / empty. Piece identity was only in software. | Hall pair per square. Occupancy, piece type, and color come from the channel pair. Measured bands and the pieces still missing from the set are in [rozpoznani-figur-2026-10-23.md](../firmware/rozpoznani-figur-2026-10-23.md). |
| **Form factor** | DevKit wiring, four promotion buttons and a reset button | Hall PCB. One gesture button (GPIO23 when `sdkconfig.defaults.hall_pcb` is applied). |
| **Firmware** | Snapshot in `kos/v1-reed/firmware/`. Not linked. | **1.8.0**. `sdkconfig.defaults` is Hall. STM32 pin map and auto-flash are the extra file `sdkconfig.defaults.hall_v2`. |
| **Video** | [YouTube intro](https://youtu.be/_MS6OP3x6Z4) shows the reed prototype | Product site shows the V2 board |

The reed multiplex write-up is [TASK_COMMUNICATION.md](../firmware/TASK_COMMUNICATION.md) and it describes that archived path, not the image you build today. Hall wiring and the STM32 bootloader are in [WIRING_ESP_STM4.md](WIRING_ESP_STM4.md). STM32 sources are `firmware/stm32_hall_c031/`.

## V2 Hall geometry (PCB)

| Dimension | Value | Notes |
|-----------|-------|--------|
| **Pitch between the 2 Hall sensors on one square** | **6.267 mm** | Center-to-center of the differential pair (sensor 0 / sensor 1 per field) |

Firmware expects two channels per square (`HALL_I2C_SENSORS_PER_FIELD`); occupancy DIFF mode uses `|r0 − r1|` — keep this pair spacing when placing footprints.
