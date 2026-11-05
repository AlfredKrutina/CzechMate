# components/squares_task/CMakeLists.txt
idf_component_register(
    SRCS "squares_task.c" "hall_i2c_squares.c" "hall_presence.c"
    INCLUDE_DIRS "include" "."
    REQUIRES freertos_chess driver ha_light_task game_task stm32_i2c_bootloader nvs_flash led_task
)

if(CONFIG_CHESS_HALL_LIFT_HYSTERESIS)
    target_compile_definitions(${COMPONENT_LIB} PRIVATE HALL_LIFT_HYSTERESIS=1)
else()
    target_compile_definitions(${COMPONENT_LIB} PRIVATE HALL_LIFT_HYSTERESIS=0)
endif()
