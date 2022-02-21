import { L, C, COLORS, LENGTH } from '../constants.js';
import { Shape } from '../models/shape.js';

var SHAPES = [
  //Orange triangle
  new Shape(C[0], LENGTH.TRIANGLE, [
    -(L/2), -(L/6),
    (L/2), -(L/6),
    0, (L/3)
  ], COLORS.ORANGE),
  //Dark Blue triangle
  new Shape(C[1], LENGTH.TRIANGLE, [
    -(L/3), 0,
    (L/6), -(L/2),
    (L/6), (L/2)
  ], COLORS.DARK_BLUE),
  //Yellow triangle
  new Shape(C[2], LENGTH.TRIANGLE, [
    0, -(L/6),
    (L/4), (L/12),
    -(L/4), (L/12)
  ], COLORS.YELLOW),
  //Red square
  new Shape(C[3], LENGTH.SQUARE, [
    0, -(L/4),
    (L/4), 0,
    0, (L/4),
    0, (L/4),
    -(L/4), 0,
    0, -(L/4)
  ], COLORS.RED),
  //Green triangle
  new Shape(C[4], LENGTH.TRIANGLE, [
    -(L/6), -(L/3),
    (L/3), (L/6),
    -(L/6), (L/6)
  ], COLORS.GREEN),
  //Light Blue triangle
  new Shape(C[5], LENGTH.TRIANGLE, [
    -(L/12), -(L/4),
    (L/6), 0,
    -(L/12), (L/4)
  ], COLORS.LIGHT_BLUE),
  //Pink parallelogram
  new Shape(C[6], LENGTH.PARALLELOGRAM, [
    -(L/8), -(3*L)/8,
    (L/8), -(L/8),
    (L/8), (3*L)/8,
    (L/8), (3*L)/8,
    -(L/8), (L/8),
    -(L/8), -(3*L)/8,
  ], COLORS.PINK),
]

export {
    SHAPES,
}