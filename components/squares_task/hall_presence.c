#include "hall_presence.h"

#include <stddef.h>

void hall_presence_reset_state(hall_presence_state_t *st) {
    if (st == NULL) {
        return;
    }
    st->occupied = false;
    st->reported = false;
    st->lift_block = false;
    st->piece_is_none = true;
    st->prove_scans = 0;
    st->vacant_scans = 0;
    st->stable_scans = 0;
    st->mask_scans = 0;
    st->lift_vacant_peak = 0;
    st->lift_ctx_fresh = false;
    st->lift_block_scans = 0;
}

void hall_presence_note_published_lift(hall_presence_state_t *st) {
    if (st == NULL) {
        return;
    }
    st->lift_ctx_fresh = false;
    st->lift_block_scans = 0;
    st->lift_vacant_peak = 0;
}

static bool hall_presence_signal(const hall_presence_inputs_t *in) {
    return in->energy >= HALL_PRESENCE_REOCCUPY_ENERGY ||
           (in->ctx_valid && in->ctx_energy >= HALL_PRESENCE_REOCCUPY_ENERGY);
}

static uint8_t hall_presence_reoccupy_need(const hall_presence_state_t *st) {
#if HALL_LIFT_HYSTERESIS
    if (st->lift_block) {
        return HALL_PRESENCE_STABLE_SCANS;
    }
#endif
    return HALL_PRESENCE_REOCCUPY_SCANS;
}

static bool hall_presence_peak_rearm_active(const hall_presence_state_t *st) {
#if HALL_LIFT_HYSTERESIS
    if (!st->lift_block || st->lift_vacant_peak <= 0) {
        return false;
    }
    if (st->lift_ctx_fresh) {
        return false;
    }
    if (st->lift_block_scans > HALL_LIFT_REARM_MAX_SCANS) {
        return false;
    }
    return true;
#else
    (void)st;
    return false;
#endif
}

static bool hall_presence_rearm_ok(const hall_presence_inputs_t *in,
                                   const hall_presence_state_t *st) {
#if HALL_LIFT_HYSTERESIS
    if (!hall_presence_peak_rearm_active(st)) {
        return true;
    }
    int32_t need = st->lift_vacant_peak + HALL_LIFT_REARM_MARGIN;
    if (need > HALL_LIFT_REARM_CAP) {
        need = HALL_LIFT_REARM_CAP;
    }
    return in->energy >= need;
#else
    (void)in;
    (void)st;
    return true;
#endif
}

void hall_presence_step(const hall_presence_inputs_t *in,
                        hall_presence_state_t *st,
                        hall_presence_result_t *out) {
#if HALL_LIFT_HYSTERESIS
    if (st->lift_block && !st->reported) {
        if (st->lift_block_scans < 65535) {
            st->lift_block_scans++;
        }
    }
#endif

    bool signal = hall_presence_signal(in);
    bool above = !in->ctx_low && !in->fringe_veto && signal &&
                 hall_presence_rearm_ok(in, st);

#if HALL_LIFT_HYSTERESIS
    if (st->lift_block && !st->reported && !st->lift_ctx_fresh &&
        st->lift_block_scans <= HALL_LIFT_REARM_MAX_SCANS) {
        bool track =
            !above && in->energy <= HALL_LIFT_VACANT_PEAK_TRACK_MAX;
        if (track && in->energy > st->lift_vacant_peak) {
            st->lift_vacant_peak = in->energy;
        }
    }
    if (st->reported) {
        st->lift_vacant_peak = 0;
    }
#endif

    if (in->royal && st->occupied && st->reported && !st->lift_block && above &&
        st->prove_scans < HALL_PRESENCE_REOCCUPY_SCANS) {
        st->prove_scans = HALL_PRESENCE_REOCCUPY_SCANS;
    }

    bool strict = st->lift_block || in->royal;
    uint8_t reoccupy_need = hall_presence_reoccupy_need(st);
    bool sensor_present;
    if (strict) {
        if (above) {
            if (st->prove_scans == 0 && st->stable_scans > 1) {
                st->stable_scans = 1;
            }
            if (st->prove_scans < 255) {
                st->prove_scans++;
            }
        } else if (st->prove_scans < reoccupy_need) {
            st->prove_scans = 0;
        }
        sensor_present = above && st->prove_scans >= reoccupy_need;
    } else if (!above) {
        sensor_present = false;
    } else {
        sensor_present = true;
    }

    if (!st->occupied || sensor_present) {
        st->vacant_scans = 0;
    } else if (st->vacant_scans < 255) {
        st->vacant_scans++;
    }

    bool mask_hold = st->occupied && st->mask_scans > 0 && above;
    bool present = sensor_present || mask_hold ||
                   (st->occupied && !st->piece_is_none &&
                    st->vacant_scans < HALL_PRESENCE_LIFT_CONFIRM_SCANS);
    if (present != st->occupied && !(present && strict)) {
        st->stable_scans = 0;
    }

    if (out != NULL) {
        out->above = above;
        out->sensor_present = sensor_present;
        out->present = present;
    }
}
