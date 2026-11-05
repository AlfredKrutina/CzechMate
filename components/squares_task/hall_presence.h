#ifndef HALL_PRESENCE_H
#define HALL_PRESENCE_H

#include <stdbool.h>
#include <stdint.h>

#define HALL_PRESENCE_STABLE_MS           250
#define HALL_PRESENCE_CYCLE_MS            25
#define HALL_PRESENCE_STABLE_SCANS        (HALL_PRESENCE_STABLE_MS / HALL_PRESENCE_CYCLE_MS)
#define HALL_PRESENCE_LIFT_CONFIRM_SCANS  2
#define HALL_PRESENCE_REOCCUPY_ENERGY     18000
#define HALL_PRESENCE_REOCCUPY_SCANS      4

/** Provisional until hardware traces confirm lift-empty crosstalk. */
#define HALL_LIFT_REARM_MARGIN            3500
/** Upper bound on re-arm threshold so a seated pawn (~60k+) always clears. */
#define HALL_LIFT_REARM_CAP               50000
/** Crosstalk hover band only — do not fold a seated piece into vacant peak. */
#define HALL_LIFT_VACANT_PEAK_TRACK_MAX   22500
/** Stop peak-based re-arm after this long vacant under lift_block (safety net). */
#define HALL_LIFT_REARM_MAX_MS            2000
#define HALL_LIFT_REARM_MAX_SCANS         (HALL_LIFT_REARM_MAX_MS / HALL_PRESENCE_CYCLE_MS)

#ifndef HALL_LIFT_HYSTERESIS
#define HALL_LIFT_HYSTERESIS              0
#endif

typedef struct {
    bool occupied;
    bool reported;
    bool lift_block;
    bool piece_is_none;
    uint8_t prove_scans;
    uint8_t vacant_scans;
    uint8_t stable_scans;
    uint8_t mask_scans;
    int32_t lift_vacant_peak;
    bool lift_ctx_fresh;
    uint16_t lift_block_scans;
} hall_presence_state_t;

typedef struct {
    int32_t energy;
    int32_t ctx_energy;
    bool ctx_valid;
    bool ctx_low;
    bool fringe_veto;
    bool royal;
} hall_presence_inputs_t;

typedef struct {
    bool above;
    bool sensor_present;
    bool present;
} hall_presence_result_t;

void hall_presence_reset_state(hall_presence_state_t *st);

void hall_presence_note_published_lift(hall_presence_state_t *st);

void hall_presence_step(const hall_presence_inputs_t *in,
                        hall_presence_state_t *st,
                        hall_presence_result_t *out);

#endif
