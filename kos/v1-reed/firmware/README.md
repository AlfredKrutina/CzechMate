# Reed V1 snapshot

Copies of the files taken before the live tree dropped the reed path. Nothing here is in `EXTRA_COMPONENT_DIRS`. The live build is Hall only (`CONFIG_CHESS_MATRIX_INPUT_I2C_HALL`).

What the live tree no longer does, and these copies still show:

- GPIO row/column multiplex and the reed move detector
- `#else` / `#if !CONFIG_CHESS_MATRIX_INPUT_I2C_HALL` branches in game, squares, and the STM32 bootloader
- Physical scan of the four promotion buttons and the GPIO15 reset switch
- Kconfig choice that defaulted to reed

What stayed live on purpose: Hall scan, STM32 bootloader, the single gesture button (`button_gesture.c`, GPIO23 when `CONFIG_CHESS_GESTURE_BUTTON` is set), promotion from Hall piece type and from the app, LEDs, web, BLE, OTA.

`freertos_chess.c` and `button_task.c` in this folder are the versions from before the reed GPIO init and the promotion/reset scan were removed. Later live edits (logs, gesture poll) are not in the snapshot.
