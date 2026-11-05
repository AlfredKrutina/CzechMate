/**
 * Host board_machine castling state tests (minimal FreeRTOS stubs).
 * clang -std=c11 -Itests/host/stubs -Icomponents/chess_core/include
 *   -Icomponents/freertos_chess/include -Icomponents/game_task/include
 *   tests/host/board_machine_host_test.c components/game_task/game_board_machine.c
 *   components/chess_core/position.c components/chess_core/fen.c
 *   components/chess_core/movegen.c -o $env:TEMP\board_machine_host_test.exe
 */
#include "game_board_machine.h"
#include "position.h"

#include <stdio.h>
#include <stdlib.h>

#define SQ(r, c) ((uint8_t)((r)*8u + (c)))

static int g_pass;
static int g_fail;

static void expect_true(int cond, const char *name) {
  if (cond) {
    g_pass++;
  } else {
    g_fail++;
    fprintf(stderr, "FAIL: %s\n", name);
  }
}

int main(void) {
  position_t pos;
  board_machine_t bm;
  board_machine_out_t out;

  g_pass = 0;
  g_fail = 0;

  expect_true(
      position_from_fen(&pos, "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQK2R w KQkq - 0 1"),
      "castle bm setup fen");

  board_machine_reset(&bm);
  (void)board_machine_lift(&bm, &pos, SQ(0, 4));
  out = board_machine_drop(&bm, &pos, SQ(0, 4), SQ(0, 6), true);
  expect_true(out.kind == BM_OUT_MOVE, "king castle drop yields move");
  expect_true(bm.state == BM_STATE_WAIT_ROOK, "state WAIT_ROOK after king castle drop");

  board_machine_reset(&bm);
  (void)board_machine_lift(&bm, &pos, SQ(1, 0));
  out = board_machine_drop(&bm, &pos, SQ(1, 0), SQ(2, 0), true);
  expect_true(out.kind == BM_OUT_MOVE, "pawn drop accepted after reset");
  expect_true(bm.state == BM_STATE_IDLE, "idle after normal move drop");

  printf("board_machine host: %d passed, %d failed\n", g_pass, g_fail);
  return g_fail == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
