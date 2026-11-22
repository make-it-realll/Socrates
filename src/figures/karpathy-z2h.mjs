import { svg, svgA, anim, ashow, f1, lin, d, path, line, rect, circle, poly, text, arrow, axes, esc } from '../lib/svg.mjs';

// 数据：h 的 histogram 来自为本页写的 numpy 复现（makemore part 2/3 的 MLP，200k step，batch 32，
// 每个记录点用 dev set 前 1000 个 example 统计），deep 来自 5 层 tanh MLP 在 1000 个 example 上的一次 forward。
// 每项是 [saturated 比例 (|h|>0.97), 40 个 bin 的频率]，bin 覆盖 [−1, 1]。
const DATA = {"orig":{"0":[0.64,[0.3277,0.0272,0.0181,0.0119,0.0126,0.0125,0.0071,0.0084,0.0068,0.0067,0.0051,0.0052,0.0049,0.0046,0.0054,0.0046,0.0054,0.0041,0.0055,0.0038,0.0047,0.0047,0.0048,0.0052,0.0045,0.004,0.0041,0.0043,0.0044,0.0055,0.006,0.0077,0.0084,0.0081,0.0087,0.01,0.0131,0.0186,0.0286,0.357]],"10":[0.658,[0.3391,0.0283,0.0181,0.0113,0.0118,0.0083,0.008,0.0064,0.0065,0.0064,0.0051,0.0065,0.0042,0.0048,0.0043,0.005,0.0034,0.0034,0.0037,0.0055,0.0039,0.0036,0.0051,0.0036,0.0062,0.0053,0.0047,0.0037,0.0044,0.0048,0.0049,0.0067,0.0066,0.0073,0.011,0.011,0.0119,0.0164,0.0261,0.3626]],"100":[0.726,[0.3544,0.0241,0.0134,0.0096,0.009,0.0083,0.0055,0.0057,0.0046,0.0046,0.0043,0.0046,0.0041,0.0038,0.0029,0.0031,0.0029,0.0029,0.0028,0.0028,0.0031,0.004,0.0031,0.0034,0.0029,0.0034,0.0035,0.0044,0.0045,0.0037,0.0044,0.0052,0.0048,0.0056,0.0062,0.0091,0.0108,0.0148,0.0256,0.404]],"300":[0.754,[0.3656,0.0231,0.0133,0.0102,0.007,0.0054,0.0049,0.0042,0.0041,0.0038,0.0032,0.0033,0.003,0.0029,0.003,0.0026,0.0031,0.0027,0.0027,0.0032,0.0027,0.0027,0.0031,0.0029,0.0031,0.0028,0.0029,0.0031,0.0034,0.0037,0.0038,0.0038,0.0041,0.0051,0.0057,0.0071,0.0094,0.0157,0.0216,0.4222]],"1000":[0.714,[0.361,0.0262,0.0168,0.0116,0.0083,0.0076,0.0055,0.0046,0.0046,0.0039,0.0039,0.0036,0.0029,0.003,0.0026,0.0028,0.0028,0.0025,0.0027,0.0027,0.0027,0.0026,0.0024,0.003,0.0027,0.0026,0.0028,0.0031,0.0032,0.0038,0.0036,0.0048,0.0049,0.0061,0.0076,0.0098,0.0121,0.0157,0.032,0.3949]],"3000":[0.695,[0.3596,0.0374,0.0189,0.0134,0.0091,0.0079,0.0056,0.0045,0.0039,0.0036,0.0031,0.0027,0.0027,0.0022,0.0022,0.0021,0.0019,0.0018,0.0018,0.0021,0.0019,0.0018,0.0019,0.0022,0.0022,0.0023,0.0024,0.0026,0.0031,0.0031,0.0033,0.0039,0.0057,0.0052,0.0064,0.0083,0.0111,0.0186,0.0359,0.3915]],"10000":[0.735,[0.3742,0.0332,0.0187,0.0108,0.0081,0.0063,0.0054,0.0041,0.0031,0.003,0.0029,0.0025,0.002,0.002,0.0016,0.0019,0.0017,0.0013,0.0016,0.0017,0.0017,0.0015,0.0019,0.0017,0.002,0.002,0.002,0.0023,0.0022,0.0025,0.0024,0.0032,0.0036,0.0047,0.0051,0.0063,0.0106,0.0136,0.0332,0.4113]],"30000":[0.808,[0.4069,0.0209,0.0119,0.0074,0.0057,0.0047,0.0036,0.0033,0.0027,0.0022,0.0023,0.0021,0.0018,0.0017,0.0015,0.0014,0.0015,0.0015,0.0016,0.0015,0.0015,0.0014,0.0014,0.0014,0.0015,0.0016,0.0017,0.002,0.0019,0.0021,0.0026,0.0024,0.0034,0.003,0.0048,0.0049,0.0065,0.0094,0.0211,0.4389]],"100000":[0.868,[0.4308,0.0141,0.0082,0.0051,0.004,0.0032,0.0028,0.0024,0.0017,0.0019,0.0017,0.0015,0.0013,0.0013,0.0014,0.0013,0.0013,0.0012,0.0012,0.0013,0.0013,0.0013,0.0012,0.0015,0.0014,0.0014,0.0013,0.0014,0.0015,0.0014,0.0018,0.0019,0.0022,0.0026,0.0031,0.0038,0.0046,0.0071,0.0131,0.4586]],"200000":[0.866,[0.4296,0.0141,0.0084,0.0051,0.004,0.0032,0.003,0.0023,0.0021,0.0019,0.0018,0.0015,0.0013,0.0015,0.0015,0.0014,0.0014,0.0014,0.0013,0.0015,0.0011,0.0016,0.0012,0.0013,0.0014,0.0013,0.0014,0.0016,0.0014,0.0015,0.0018,0.002,0.0022,0.0021,0.0028,0.0035,0.0057,0.008,0.0119,0.4584]]},"fixall":{"0":[0.124,[0.0826,0.0485,0.0344,0.0307,0.0274,0.021,0.0224,0.0193,0.0202,0.0165,0.0175,0.0179,0.0176,0.018,0.0179,0.0157,0.0157,0.0163,0.0161,0.0142,0.0152,0.0146,0.0138,0.0145,0.0179,0.0177,0.0145,0.0184,0.0165,0.0176,0.0183,0.0192,0.0204,0.0204,0.0234,0.0266,0.0335,0.0416,0.0546,0.0913]],"10":[0.125,[0.0828,0.0484,0.0346,0.0312,0.027,0.0209,0.022,0.0197,0.02,0.0166,0.0182,0.0171,0.0185,0.0171,0.018,0.0157,0.016,0.0169,0.0151,0.014,0.0152,0.0149,0.0136,0.0136,0.0191,0.0173,0.0147,0.0183,0.0164,0.0173,0.0188,0.0181,0.0199,0.0216,0.0233,0.0265,0.0334,0.0425,0.0542,0.0914]],"100":[0.128,[0.0839,0.0492,0.0354,0.0336,0.0222,0.0221,0.0228,0.0208,0.0188,0.0193,0.0163,0.0162,0.017,0.0169,0.0171,0.0165,0.0168,0.0149,0.0158,0.0145,0.0126,0.014,0.0175,0.0151,0.0159,0.0172,0.0163,0.0149,0.0157,0.0206,0.0184,0.0177,0.0202,0.0222,0.0223,0.0262,0.0304,0.043,0.0554,0.0944]],"300":[0.13,[0.0878,0.0475,0.0365,0.0303,0.0244,0.0235,0.0222,0.0204,0.0184,0.0193,0.0172,0.0153,0.0188,0.0154,0.0146,0.0165,0.0135,0.0169,0.0145,0.0156,0.0154,0.0158,0.0128,0.0132,0.0172,0.0149,0.0165,0.0191,0.0161,0.0202,0.0181,0.0188,0.019,0.0201,0.0233,0.0275,0.0297,0.0422,0.0566,0.0944]],"1000":[0.136,[0.089,0.0485,0.0367,0.0271,0.0234,0.0238,0.0217,0.0205,0.0186,0.0183,0.0176,0.016,0.0167,0.0158,0.0144,0.0141,0.016,0.0124,0.0172,0.0159,0.014,0.0144,0.0138,0.0153,0.0228,0.014,0.0174,0.0168,0.0175,0.0179,0.0186,0.0203,0.0191,0.0197,0.0249,0.0271,0.0319,0.0381,0.054,0.0991]],"3000":[0.148,[0.0939,0.0456,0.0328,0.0261,0.027,0.0205,0.0208,0.0203,0.0174,0.0183,0.0153,0.0153,0.0162,0.0139,0.018,0.0153,0.016,0.0156,0.0127,0.0184,0.0148,0.0163,0.0177,0.0168,0.0161,0.0179,0.0188,0.0146,0.0182,0.0204,0.0189,0.0198,0.0231,0.0188,0.0252,0.0267,0.029,0.0344,0.0497,0.1031]],"10000":[0.161,[0.1001,0.0426,0.0327,0.024,0.0241,0.0209,0.0201,0.0173,0.0181,0.0168,0.0157,0.0149,0.0144,0.0147,0.0159,0.0156,0.0178,0.0177,0.022,0.0172,0.0172,0.0173,0.0229,0.0171,0.0159,0.017,0.0216,0.0188,0.0139,0.0183,0.0185,0.0197,0.0175,0.0209,0.0198,0.0267,0.0263,0.0328,0.0418,0.1135]],"30000":[0.196,[0.1156,0.0418,0.029,0.0241,0.0202,0.0194,0.0192,0.0166,0.0145,0.0164,0.0138,0.0152,0.0137,0.0136,0.0145,0.0152,0.0181,0.0188,0.0209,0.0243,0.0208,0.023,0.0214,0.0186,0.0167,0.0162,0.0164,0.0149,0.0174,0.0152,0.0146,0.0155,0.0184,0.0188,0.0201,0.0229,0.0241,0.029,0.0423,0.1284]],"100000":[0.266,[0.1509,0.0394,0.0266,0.0226,0.0186,0.0155,0.0146,0.0138,0.0126,0.0116,0.0129,0.0126,0.0106,0.0143,0.0118,0.0162,0.0208,0.0209,0.0188,0.0232,0.0238,0.0233,0.0191,0.0215,0.0115,0.0143,0.0177,0.0104,0.012,0.0144,0.0119,0.0144,0.0135,0.0156,0.0164,0.0185,0.0211,0.029,0.0392,0.1641]],"200000":[0.305,[0.1704,0.0376,0.0254,0.0208,0.0183,0.0157,0.0143,0.0127,0.0119,0.0105,0.0115,0.0124,0.0111,0.0111,0.0121,0.0206,0.0153,0.0153,0.0178,0.0185,0.0183,0.0238,0.0165,0.0197,0.0202,0.0133,0.0103,0.01,0.0142,0.0157,0.0105,0.0125,0.0126,0.0142,0.015,0.0187,0.0209,0.0262,0.04,0.1842]]},"deep":{"1.0":[[0.585,0.017,[0.0193,0.0269,0.0346,0.0296,0.0284,0.0305,0.0264,0.0253,0.0254,0.0275,0.0232,0.0254,0.0224,0.0275,0.0261,0.0261,0.0283,0.0235,0.0209,0.0237,0.0239,0.02,0.0242,0.0204,0.0221,0.0246,0.0188,0.0236,0.0221,0.0267,0.0225,0.026,0.0311,0.0248,0.0262,0.027,0.027,0.0265,0.0254,0.0159]],[0.453,0.0,[0.0005,0.0031,0.0074,0.0094,0.0134,0.0191,0.0215,0.0222,0.0244,0.0299,0.0272,0.029,0.0328,0.0318,0.0341,0.0334,0.0331,0.0332,0.0364,0.0337,0.0407,0.0337,0.0321,0.0407,0.034,0.0345,0.0336,0.0314,0.0275,0.0329,0.0336,0.0302,0.0227,0.0241,0.0212,0.0197,0.0144,0.0119,0.0046,0.0008]],[0.392,0.0,[0.0001,0.0006,0.0017,0.0044,0.0093,0.0118,0.015,0.0206,0.0275,0.0256,0.0302,0.0292,0.034,0.0378,0.0357,0.0383,0.0453,0.0386,0.0449,0.0427,0.0393,0.0419,0.0472,0.0379,0.0448,0.0358,0.0368,0.036,0.0355,0.0297,0.0307,0.0248,0.0217,0.0189,0.0114,0.0075,0.004,0.0024,0.0006,0.0001]],[0.342,0.0,[0.0,0.0,0.0004,0.0019,0.0038,0.0064,0.0101,0.0123,0.0209,0.0225,0.0254,0.0269,0.0353,0.0392,0.0397,0.0451,0.0447,0.0461,0.0499,0.0504,0.0586,0.0523,0.0499,0.0502,0.0468,0.0448,0.0431,0.0378,0.0307,0.0271,0.0205,0.0206,0.0132,0.0097,0.0074,0.0041,0.0014,0.0005,0.0,0.0]],[0.306,0.0,[0.0,0.0,0.0001,0.0007,0.0012,0.0044,0.0054,0.0119,0.0184,0.0198,0.022,0.0298,0.0364,0.0389,0.0424,0.0519,0.061,0.0566,0.0563,0.0601,0.0614,0.0574,0.0556,0.05,0.0478,0.0436,0.036,0.0371,0.0304,0.0191,0.0165,0.0108,0.0073,0.0057,0.0027,0.0009,0.0004,0.0001,0.0,0.0]]],"1.667":[[0.725,0.149,[0.1102,0.0541,0.0376,0.0317,0.0273,0.0241,0.0191,0.0212,0.018,0.0196,0.0192,0.017,0.0156,0.0164,0.0186,0.018,0.0123,0.013,0.0156,0.0125,0.015,0.0126,0.0115,0.0132,0.0165,0.0133,0.0123,0.0158,0.0181,0.0143,0.0146,0.0181,0.017,0.022,0.0227,0.0269,0.0361,0.0358,0.0484,0.0945]],[0.67,0.073,[0.0488,0.0434,0.0335,0.0288,0.0337,0.0225,0.0265,0.0195,0.0211,0.0245,0.0168,0.0185,0.0146,0.0154,0.0231,0.0175,0.0181,0.0174,0.0151,0.0185,0.0189,0.0193,0.0172,0.0165,0.0198,0.0161,0.0173,0.0201,0.0191,0.0202,0.0231,0.0257,0.0205,0.0228,0.0248,0.0287,0.0326,0.0435,0.0478,0.0686]],[0.666,0.062,[0.0541,0.0432,0.0344,0.0355,0.0259,0.025,0.0243,0.0245,0.0233,0.02,0.0204,0.0205,0.0175,0.0163,0.0177,0.0159,0.0197,0.0149,0.0168,0.0199,0.0158,0.0173,0.0206,0.02,0.0167,0.0165,0.0155,0.021,0.0212,0.0211,0.0215,0.0262,0.0234,0.0262,0.0248,0.0301,0.0322,0.0409,0.0453,0.0537]],[0.653,0.06,[0.0478,0.0446,0.0312,0.029,0.0328,0.0258,0.0264,0.0232,0.0216,0.0194,0.0171,0.0172,0.0214,0.0191,0.0153,0.017,0.0158,0.0187,0.0157,0.0194,0.02,0.0193,0.0193,0.0245,0.0178,0.0181,0.0226,0.023,0.0228,0.0223,0.0199,0.0209,0.0254,0.0279,0.0279,0.032,0.0363,0.0329,0.0392,0.0493]],[0.649,0.054,[0.0476,0.0466,0.0367,0.0368,0.0283,0.0249,0.0272,0.0255,0.0245,0.0232,0.0212,0.0233,0.0194,0.02,0.0227,0.0201,0.0183,0.0209,0.0184,0.0174,0.0164,0.0163,0.019,0.0162,0.0226,0.016,0.018,0.0201,0.0225,0.0241,0.0216,0.0204,0.0193,0.0256,0.027,0.0304,0.0247,0.0408,0.0347,0.0412]]],"3.0":[[0.841,0.421,[0.2522,0.0434,0.0288,0.0204,0.0204,0.018,0.0143,0.011,0.0151,0.0102,0.01,0.0144,0.0096,0.0076,0.007,0.0069,0.0081,0.0097,0.0077,0.0064,0.0077,0.0084,0.008,0.0068,0.0064,0.0078,0.0075,0.012,0.0075,0.0088,0.0089,0.0106,0.0128,0.0144,0.013,0.0137,0.0219,0.0258,0.0442,0.2327]],[0.83,0.398,[0.207,0.0464,0.0303,0.0202,0.0164,0.0173,0.014,0.0137,0.013,0.0095,0.0097,0.0113,0.0096,0.0122,0.0091,0.0088,0.0069,0.0097,0.0073,0.0095,0.008,0.0067,0.0071,0.0097,0.0073,0.0098,0.0092,0.0089,0.0087,0.0137,0.0128,0.0125,0.0127,0.0142,0.0141,0.0193,0.0226,0.0297,0.0429,0.248]],[0.839,0.407,[0.2301,0.0404,0.0296,0.0221,0.0177,0.0156,0.0136,0.0137,0.0106,0.0111,0.0094,0.0076,0.0088,0.007,0.0072,0.0077,0.0089,0.006,0.0098,0.0071,0.0094,0.0089,0.0082,0.0092,0.0102,0.0089,0.0067,0.0075,0.0106,0.0087,0.0106,0.0094,0.0102,0.0132,0.0198,0.0229,0.0194,0.0328,0.0518,0.2376]],[0.837,0.401,[0.2299,0.0431,0.0255,0.0221,0.0171,0.018,0.014,0.0111,0.0099,0.012,0.0109,0.0071,0.0095,0.0106,0.0088,0.0077,0.0081,0.0101,0.0082,0.0085,0.0064,0.0089,0.0079,0.0073,0.0098,0.0084,0.0073,0.0077,0.0082,0.0091,0.0105,0.0108,0.0117,0.0156,0.0178,0.0208,0.0236,0.0343,0.0477,0.2341]],[0.833,0.403,[0.2468,0.0467,0.0332,0.0252,0.0167,0.0138,0.013,0.0129,0.012,0.0107,0.0105,0.0094,0.0083,0.0095,0.0081,0.009,0.0082,0.0075,0.0078,0.0086,0.0079,0.0067,0.0087,0.0136,0.0062,0.0097,0.0114,0.0093,0.011,0.0103,0.0116,0.0119,0.0127,0.0131,0.0131,0.0163,0.0197,0.0309,0.0413,0.2167]]]}};

const fmt = (v, k = 4) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);

// ---------- 第 1 站：micrograd 计算图上的 backward（动图） ----------
function graphA() {
  // forward：和 micrograd lecture notebook 里的 neuron 完全一样
  const V = {};
  V.x1 = 2; V.w1 = -3; V.x2 = 0; V.w2 = 1; V.b = 6.8813735870195432;
  V.x1w1 = V.x1 * V.w1; V.x2w2 = V.x2 * V.w2; V.s = V.x1w1 + V.x2w2; V.n = V.s + V.b; V.o = Math.tanh(V.n);
  // backward：按 reverse topological order，每一步用一条 local rule
  const G = {};
  G.o = 1;
  G.n = (1 - V.o ** 2) * G.o;
  G.s = G.n; G.b = G.n;
  G.x1w1 = G.s; G.x2w2 = G.s;
  G.x1 = V.w1 * G.x1w1; G.w1 = V.x1 * G.x1w1;
  G.x2 = V.w2 * G.x2w2; G.w2 = V.x2 * G.x2w2;
  const W = 84, H = 52;
  const pos = { x1: [0, 6], w1: [0, 66], x2: [0, 150], w2: [0, 210], x1w1: [116, 36], x2w2: [116, 180], s: [232, 108], b: [232, 200], n: [348, 150], o: [476, 150] };
  const lab = { x1: 'x1', w1: 'w1', x2: 'x2', w2: 'w2', x1w1: 'x1·w1', x2w2: 'x2·w2', s: 'x1w1+x2w2', b: 'b', n: 'n', o: 'o' };
  const steps = [['o'], ['n'], ['s', 'b'], ['x1w1', 'x2w2'], ['x1', 'w1'], ['x2', 'w2']];
  const note = [
    'o.grad = 1：dL/dL',
    'tanh：n.grad = (1 − o²) · o.grad = ' + fmt(G.n, 2),
    '+：两个 input 原样拿到 out.grad',
    '+：再传一次，还是 ' + fmt(G.s, 2),
    '*：x1.grad = w1.data · out.grad，w1.grad = x1.data · out.grad',
    '*：x2.grad = w2.data · out.grad = 0.5，w2.grad = x2.data · out.grad = 0',
  ];
  const hold = 2.6, dt = 1.5, T = hold + 0.4 + dt * steps.length + 1.2;
  // frame 0：完整结果；然后清空 grad，再一步步出现
  const kt = [0, hold / T];
  for (let i = 0; i < steps.length; i++) kt.push((hold + 0.4 + dt * i) / T);
  kt.push(1);
  const nf = kt.length; // 0: full, 1: cleared, 2..: step i, last: end(full)
  const stepOf = {};
  steps.forEach((g, i) => g.forEach((k) => (stepOf[k] = i)));
  const vis = (k) => kt.map((_, f) => (f === 0 || f === nf - 1 ? 1 : f === 1 ? 0 : f - 2 >= stepOf[k] ? 1 : 0));
  let o = '';
  const mid = (k, side) => { const [x, y] = pos[k]; return side === 'r' ? [x + W, y + H / 2] : [x, y + H / 2]; };
  const opc = { x1w1: [100, 0, '*'], x2w2: [100, 0, '*'], s: [216, 0, '+'], n: [332, 0, '+'], o: [454, 0, 'tanh'] };
  const ins = { x1w1: ['x1', 'w1'], x2w2: ['x2', 'w2'], s: ['x1w1', 'x2w2'], n: ['s', 'b'], o: ['n'] };
  for (const [k, list] of Object.entries(ins)) {
    const [, ty] = mid(k, 'l');
    const cx = opc[k][0];
    const rw = opc[k][2] === 'tanh' ? 15 : 9;
    for (const j of list) { const [sx, sy] = mid(j, 'r'); o += path(d([[sx, sy], [cx - rw, ty]]), 'mute'); }
    o += arrow(cx + rw, ty, pos[k][0], ty, 'mute', 5);
    o += (rw > 9 ? rect(cx - rw, ty - 9, 2 * rw, 18, 'paper', 9) : circle(cx, ty, 9, 'paper')) + text(cx, ty + (rw > 9 ? 4 : 4.5), opc[k][2], rw > 9 ? 'ts' : 'tb', 'middle');
  }
  // 高亮当前这一步在处理的 node
  for (const k of Object.keys(pos)) {
    const on = kt.map((_, f) => (f >= 2 && f < nf - 1 && steps[f - 2].includes(k) ? 1 : 0));
    const [x, y] = pos[k];
    o += `<rect x="${x - 3}" y="${y - 3}" width="${W + 6}" height="${H + 6}" rx="7" class="wash-strong" opacity="0">${anim('opacity', on, kt, T, true)}</rect>`;
  }
  for (const k of Object.keys(pos)) {
    const [x, y] = pos[k];
    o += rect(x, y, W, H, 'paper', 5);
    o += text(x + W / 2, y + 15, lab[k], 'tb', 'middle');
    o += text(x + 8, y + 31, 'data ' + fmt(V[k]), 'ts');
    o += `<text x="${x + 8}" y="${y + 46}" class="tl" text-anchor="start">grad ${fmt(G[k])}${anim('opacity', vis(k), kt, T, true)}</text>`;
  }
  // 底部说明：每一步用的 local rule
  const yN = 288;
  o += `<text x="280" y="${yN}" class="ts" text-anchor="middle">完整结果：o = tanh(n) = ${fmt(V.o)}，四个 input 的 grad 都已算出${anim('opacity', kt.map((_, f) => (f === 0 || f === nf - 1 ? 1 : 0)), kt, T, true)}</text>`;
  o += `<text x="280" y="${yN}" class="ts" text-anchor="middle">清空所有 grad，从 o 开始往回走${anim('opacity', kt.map((_, f) => (f === 1 ? 1 : 0)), kt, T, true)}</text>`;
  note.forEach((s, i) => {
    o += `<text x="280" y="${yN}" class="tl" text-anchor="middle" opacity="0">第 ${i + 1} 步　${s}${anim('opacity', kt.map((_, f) => (f === i + 2 ? 1 : 0)), kt, T, true)}</text>`;
  });
  return svgA(560, 300, o, '动图：micrograd notebook 里的一个 neuron。o 等于 tanh(x1 w1 + x2 w2 + b)，等于 0.7071。Backward 从 o 开始按 reverse topological order 一步步把 grad 填进每个 node：n 是 0.5，两个加法节点都是 0.5，x1 是 −1.5，w1 是 1，x2 是 0.5，w2 是 0');
}

// ---------- 第 1 站：同一个 Value 被用两次，grad 要累加 ----------
function fork() {
  let o = '';
  const panel = (x0, title, ga, note, cls) => {
    o += text(x0 + 125, 18, title, 'tb', 'middle');
    o += rect(x0 + 10, 60, 80, 46, 'paper', 5) + text(x0 + 50, 78, 'a', 'tb', 'middle') + text(x0 + 50, 96, 'data 3', 'ts', 'middle');
    o += path(d([[x0 + 90, 75], [x0 + 140, 72]]), 'mute') + path(d([[x0 + 90, 91], [x0 + 140, 94]]), 'mute');
    o += circle(x0 + 150, 83, 10, 'paper') + text(x0 + 150, 88, '+', 'tb', 'middle');
    o += arrow(x0 + 160, 83, x0 + 178, 83, 'mute', 5);
    o += rect(x0 + 180, 60, 64, 46, 'paper', 5) + text(x0 + 212, 78, 'b', 'tb', 'middle') + text(x0 + 212, 96, 'data 6', 'ts', 'middle');
    o += text(x0 + 212, 124, 'grad 1', 'ts', 'middle');
    o += text(x0 + 50, 124, 'a.grad = ' + ga, cls, 'middle');
    o += text(x0 + 125, 152, note, 'ts', 'middle');
  };
  panel(0, 'self.grad = 1.0 * out.grad', '1', 'other 就是 self，第二次赋值盖掉了第一次', 't');
  panel(290, 'self.grad += 1.0 * out.grad', '2', '两条边各贡献 1，加起来是 db/da = 2', 'tl');
  o += line(280, 30, 280, 160, 'grid');
  return svg(560, 165, o, 'b 等于 a 加 a，a 等于 3。用赋值写 backward，a 的 grad 是 1，错了；用加等于累加，a 的 grad 是 2，正确');
}

// ---------- 第 2 站：bigram 的 count matrix ----------
function counts() {
  const rows = ['.', 'a', 'e', 'm', 'q'];
  const cols = ['.', 'a', 'e', 'm', 'n', 'u'];
  const N = [[0, 4410, 1531, 2538, 1146, 78], [6640, 556, 692, 1634, 5438, 381], [3983, 679, 1271, 769, 2675, 69], [516, 2590, 818, 168, 20, 139], [28, 13, 1, 2, 0, 206]];
  const RS = [32033, 33885, 20423, 6642, 272];
  const x0 = 70, y0 = 46, cw = 62, ch = 34;
  let o = text(x0 + cw * 3, 18, '下一个 character', 'ts', 'middle');
  cols.forEach((c, j) => (o += text(x0 + j * cw + cw / 2, y0 - 8, c, 'tb', 'middle')));
  o += text(x0 + 6 * cw + 44, y0 - 8, 'row sum', 'ts', 'middle');
  o += text(22, y0 + ch * 2.5, '当前', 'ts', 'middle') + text(22, y0 + ch * 2.5 + 15, 'char', 'ts', 'middle');
  rows.forEach((r, i) => {
    o += text(x0 - 14, y0 + i * ch + 22, r, 'tb', 'middle');
    cols.forEach((c, j) => {
      const x = x0 + j * cw, y = y0 + i * ch, frac = N[i][j] / RS[i];
      o += rect(x, y, cw - 2, ch - 2, 'paper', 2);
      o += rect(x + 3, y + ch - 9, Math.max(0.5, (cw - 8) * frac), 4, 'solid', 1);
      o += text(x + cw / 2, y + 17, String(N[i][j]), N[i][j] === 0 ? 'tl' : 't', 'middle');
    });
    o += text(x0 + 6 * cw + 44, y0 + i * ch + 22, String(RS[i]), 'ts', 'middle');
  });
  const yb = y0 + 5 * ch + 22;
  o += text(x0, yb, '每格下方的条是这一格占整行的比例，也就是 P(下一个 | 当前)。', 'ts');
  o += text(x0, yb + 17, '只画了 27 列里的 6 列，所以条加起来不到一整行。q 后面接 n 一次也没有出现。', 'ts');
  return svg(560, yb + 24, o, 'names.txt 的 bigram count matrix 的一部分：行是第一个 character，列是下一个 character，例如点号后接 a 出现 4410 次，q 后接 u 206 次，q 后接 n 0 次');
}

// ---------- 第 2 站：one-hot 乘 W 就是取出一行 ----------
function onehot() {
  let o = '';
  const n = 9, s = 15, y0 = 64;
  // one-hot row vector（画 27 中的前 9 个，index 5 = e）
  o += text(10, 26, 'one-hot(e)：1 × 27', 'tb');
  for (let j = 0; j < n; j++) o += rect(10 + j * s, y0, s - 2, s - 2, j === 5 ? 'solid' : 'paper', 2);
  o += text(10 + n * s + 4, y0 + 11, '…', 'ts');
  o += text(10 + 5 * s + 6, y0 + 32, 'index 5', 'ts', 'middle');
  o += text(180, y0 + 12, '@', 'tbig', 'middle');
  // W
  const wx = 200, wy = 40;
  o += text(wx, 26, 'W：27 × 27', 'tb');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += rect(wx + j * s, wy + i * s, s - 2, s - 2, i === 5 ? 'wash-strong' : 'wash2', 1);
  o += text(wx + n * s + 6, wy + 5 * s + 11, '← row 5', 'tl');
  o += text(wx + 4 * s, wy + n * s + 16, '⋮', 'ts', 'middle');
  // 结果
  const rx = 400;
  o += text(rx - 26, y0 + 12, '=', 'tbig', 'middle');
  o += text(rx, 26, 'logits：1 × 27', 'tb');
  for (let j = 0; j < n; j++) o += rect(rx + j * s, y0, s - 2, s - 2, 'wash-strong', 1);
  o += text(rx + n * s + 4, y0 + 11, '…', 'ts');
  o += text(rx, y0 + 34, '就是 W 的 row 5', 'ts');
  const y2 = 214;
  o += text(10, y2, 'logits', 't') + arrow(60, y2 - 4, 96, y2 - 4, 'ink', 6) + text(78, y2 - 12, 'exp', 'ts', 'middle');
  o += text(102, y2, 'counts', 't') + arrow(156, y2 - 4, 196, y2 - 4, 'ink', 6) + text(176, y2 - 12, '÷ row sum', 'ts', 'middle');
  o += text(202, y2, 'probs：P(下一个 | e)', 't');
  o += text(10, y2 + 24, 'W 的每一行是一个“log count”，exp 之后归一化，作用和 count matrix 的一行完全相同。', 'ts');
  return svg(560, y2 + 30, o, 'One-hot vector 乘 W 等于取出 W 的一行；这一行经过 exp 和归一化，就是给定当前 character时下一个 character的 probability');
}

// ---------- 第 2 站：MLP language model 的结构 ----------
function mlp() {
  let o = '';
  const ctx = ['e', 'm', 'm'], ids = [5, 13, 13];
  ctx.forEach((c, i) => {
    const y = 30 + i * 62;
    o += rect(6, y, 34, 30, 'paper', 4) + text(23, y + 20, c, 'tb', 'middle') + text(23, y + 46, 'ix ' + ids[i], 'ts', 'middle');
    o += arrow(42, y + 15, 70, y + 15, 'mute', 5);
    // C 的一行：10 维
    for (let k = 0; k < 10; k++) o += rect(72 + k * 9, y + 8, 8, 14, 'wash-strong', 1);
    o += path(d([[164, y + 15], [190, 104]]), 'mute');
  });
  o += text(117, 22, 'C[ix]：每个 10 维', 'ts', 'middle');
  o += text(117, 228, 'C 是 27 × 10，三个位置共用', 'ts', 'middle');
  // concat 30
  o += rect(192, 30, 22, 150, 'wash', 3) + text(203, 196, '30', 'ts', 'middle') + text(203, 212, 'concat', 'ts', 'middle');
  o += arrow(216, 105, 244, 105, 'ink', 6);
  o += rect(246, 74, 92, 62, 'paper', 6) + text(292, 98, 'W1：30×200', 't', 'middle') + text(292, 118, '+ b1，tanh', 't', 'middle');
  o += arrow(340, 105, 362, 105, 'ink', 6);
  o += rect(364, 20, 18, 170, 'wash', 3) + text(373, 206, 'h：200', 'ts', 'middle');
  o += arrow(384, 105, 404, 105, 'ink', 6);
  o += rect(406, 74, 86, 62, 'paper', 6) + text(449, 98, 'W2：200×27', 't', 'middle') + text(449, 118, '+ b2', 't', 'middle');
  o += arrow(494, 105, 512, 105, 'ink', 6);
  o += rect(514, 52, 40, 106, 'paper', 4) + text(534, 100, 'soft', 'ts', 'middle') + text(534, 116, 'max', 'ts', 'middle');
  o += text(534, 178, '27 个', 'ts', 'middle') + text(534, 194, 'probability', 'ts', 'middle');
  o += text(292, 160, '11,897 个 parameter', 'tl', 'middle');
  return svg(560, 236, o, 'MLP language model：三个 context character各自从 27 乘 10 的 embedding table C 里取出一行，拼成 30 维，经过 200 个 tanh unit，再映射到 27 个 logit 并做 softmax');
}

// ---------- 第 3 站：训练过程中 hidden activation 的分布（动图） ----------
function satA() {
  const steps = ['0', '10', '100', '300', '1000', '3000', '10000', '30000', '100000', '200000'];
  const fr = 1.1, T = fr * steps.length + 1.6;
  const kt = steps.map((_, i) => (i * fr) / T).concat([1]);
  const seq = steps.concat([steps[steps.length - 1]]);
  let o = '';
  const panel = (x0, mode, title, sub) => {
    const sx = lin(-1, 1, x0, x0 + 240), sy = lin(0, 0.45, 220, 52);
    o += text(x0 + 120, 18, title, 'tb', 'middle') + text(x0 + 120, 36, sub, 'ts', 'middle');
    o += axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 0.45, xt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], yt: [] });
    o += rect(sx(-1), 52, sx(-0.97) - sx(-1), 168, 'wash2') + rect(sx(0.97), 52, sx(1) - sx(0.97), 168, 'wash2');
    const shape = (h) => {
      const pts = [[sx(-1), sy(0)]];
      h.forEach((v, i) => { const a = -1 + i * 0.05; pts.push([sx(a), sy(Math.min(v, 0.45))], [sx(a + 0.05), sy(Math.min(v, 0.45))]); });
      pts.push([sx(1), sy(0)]);
      return d(pts) + 'Z';
    };
    o += `<path d="${shape(DATA[mode][seq[0]][1])}" class="wash-strong">${anim('d', seq.map((s) => shape(DATA[mode][s][1])), kt, T, true)}</path>`;
    o += `<path d="${shape(DATA[mode][seq[0]][1])}" class="ln" fill="none">${anim('d', seq.map((s) => shape(DATA[mode][s][1])), kt, T, true)}</path>`;
    seq.forEach((s, i) => {
      if (i === seq.length - 1) return;
      const on = kt.map((_, f) => (Math.min(f, steps.length - 1) === i ? 1 : 0));
      const sat = DATA[mode][s][0];
      o += `<text x="${x0 + 120}" y="254" class="tl" text-anchor="middle" opacity="${i ? 0 : 1}">|h| &gt; 0.97：${(sat * 100).toFixed(1)}%${anim('opacity', on, kt, T, true)}</text>`;
    });
  };
  panel(10, 'orig', 'W1、b1 直接用 randn', 'pre-activation 的 std 约 4.7');
  panel(300, 'fixall', 'W1 × (5/3)/√30，b1 × 0.01', 'pre-activation 的 std 约 1.4');
  seq.forEach((s, i) => {
    if (i === seq.length - 1) return;
    const on = kt.map((_, f) => (Math.min(f, steps.length - 1) === i ? 1 : 0));
    o += `<text x="280" y="280" class="tb" text-anchor="middle" opacity="${i ? 0 : 1}">step ${Number(s).toLocaleString('en-US')} / 200,000${anim('opacity', on, kt, T, true)}</text>`;
  });
  o += text(280, 300, '灰色窄条是 |h| > 0.97 的区域。每一帧之间 step 大约乘 3。', 'ts', 'middle');
  return svgA(560, 306, o, '动图：同一个 MLP 两种 initialization，训练过程中 200 个 tanh hidden unit 的 output 的 histogram。左边一开始就有 64% 落在 ±0.97 以外，训练到最后升到 87%；右边从 12% 开始，最后 31%');
}

// ---------- 第 3 站：5 层 tanh MLP，三种 gain 下每层的 activation ----------
function deep() {
  const gains = [['1.0', 'gain 1'], ['1.667', 'gain 5/3'], ['3.0', 'gain 3']];
  const cw = 164, ch = 46, x0 = 48, y0 = 34;
  let o = '';
  gains.forEach(([g, lab], c) => (o += text(x0 + c * (cw + 8) + cw / 2, 18, lab, 'tb', 'middle')));
  for (let l = 0; l < 5; l++) {
    o += text(4, y0 + l * (ch + 6) + 28, 'layer ' + (l + 1), 'ts');
    gains.forEach(([g], c) => {
      const [sd, sat, h] = DATA.deep[g][l];
      const X = x0 + c * (cw + 8), Y = y0 + l * (ch + 6);
      const sx = lin(-1, 1, X, X + 100), sy = lin(0, 0.25, Y + ch, Y + 4);
      o += rect(X - 2, Y, 104, ch, 'frame');
      const pts = [[sx(-1), sy(0)]];
      h.forEach((v, i) => { const a = -1 + i * 0.05; pts.push([sx(a), sy(Math.min(v, 0.25))], [sx(a + 0.05), sy(Math.min(v, 0.25))]); });
      pts.push([sx(1), sy(0)]);
      o += path(d(pts) + 'Z', 'wash-strong') + path(d(pts), 'ln');
      o += text(X + 106, Y + 18, 'std ' + sd.toFixed(2), 'ts') + text(X + 106, Y + 36, 'sat ' + (sat * 100).toFixed(1) + '%', sat > 0.2 ? 'tl' : 'ts');
    });
  }
  const yb = y0 + 5 * (ch + 6) + 14;
  o += text(x0, yb, '每个小框是一层 tanh output 在 [−1, 1] 上的 histogram（1000 个 example × 100 个 unit）。', 'ts');
  o += text(x0, yb + 17, 'gain 1 时一层比一层窄；gain 3 时 40% 贴在 ±1；gain 5/3 时各层大致一样。', 'ts');
  return svg(560, yb + 22, o, '5 层 tanh MLP 在 initialization 时每层 activation 的 histogram。Gain 1 时 std 从 0.59 降到 0.31；gain 5/3 时各层 std 都在 0.65 到 0.73；gain 3 时每层约 40% saturated');
}

// ---------- 第 4 站：BatchNorm forward 的计算图：两处 fork、两处 broadcast ----------
function bngraph() {
  let o = '';
  const B = (x, y, w, s, cls = 'paper') => rect(x, y, w, 30, cls, 5) + text(x + w / 2, y + 20, s, 't', 'middle');
  o += B(6, 110, 70, 'hprebn', 'wash');
  o += B(118, 30, 80, 'bnmeani');
  o += B(118, 110, 80, 'bndiff', 'wash');
  o += B(238, 30, 80, 'bndiff2');
  o += B(352, 30, 76, 'bnvar');
  o += B(462, 30, 92, 'bnvar_inv');
  o += B(352, 160, 76, 'bnraw');
  o += B(462, 160, 92, 'hpreact');
  o += arrow(76, 118, 118, 52, 'ln', 6) + arrow(76, 125, 116, 125, 'ln', 6);
  o += arrow(158, 60, 158, 108, 'ink', 6);
  o += arrow(198, 118, 238, 52, 'ln', 6) + arrow(198, 132, 350, 172, 'ln', 6);
  o += arrow(318, 45, 350, 45, 'ink', 6) + arrow(428, 45, 460, 45, 'ink', 6);
  o += arrow(508, 60, 410, 158, 'ink', 6);
  o += arrow(428, 175, 460, 175, 'ink', 6);
  o += text(166, 88, 'broadcast', 'ts', 'start') + text(41, 158, 'fork', 'tl', 'middle') + text(158, 158, 'fork', 'tl', 'middle');
  o += text(158, 18, 'sum over batch', 'ts', 'middle') + text(390, 18, 'sum over batch', 'ts', 'middle');
  o += text(482, 130, 'broadcast', 'ts', 'start');
  o += text(6, 222, '彩色箭头：一个量被用了两次，backward 时两路传回的 gradient 相加（+=）。', 'ts');
  o += text(6, 240, '“sum over batch” 把 (32, 64) 变成 (1, 64)，backward 时把 (1, 64) broadcast 回去；', 'ts');
  o += text(6, 258, '“broadcast” 在 forward 时把 (1, 64) 复制成 (32, 64)，backward 时要沿 batch 求 sum。', 'ts');
  return svg(560, 264, o, 'BatchNorm 拆成小步的计算图：hprebn 同时进入 bnmeani 和 bndiff，bndiff 同时进入 bndiff2 和 bnraw；mean 和 variance 是沿 batch 的 sum，减去 mean 和乘 bnvar_inv 是 broadcast');
}

// ---------- 第 5 站：flat 与 hierarchical ----------
function wavenet() {
  const ch = ['.', '.', 'd', 'i', 'o', 'n', 'd', 'r'];
  let o = '';
  const row = (x0, y) => ch.forEach((c, i) => (o += rect(x0 + i * 30, y, 26, 24, 'paper', 3) + text(x0 + i * 30 + 13, y + 17, c, 't', 'middle')));
  // 左：flat
  o += text(125, 18, 'flat：8 个 embedding 一次进 Linear', 'tb', 'middle');
  row(6, 196);
  const fx = 66, fy = 70;
  ch.forEach((_, i) => (o += path(d([[6 + i * 30 + 13, 194], [fx + 60, fy + 34]]), 'mute')));
  o += rect(fx, fy, 120, 34, 'wash', 5) + text(fx + 60, fy + 22, 'Linear(80 → 200)', 't', 'middle');
  o += arrow(fx + 60, fy, fx + 60, 40, 'ink', 6) + text(fx + 70, 50, '预测 e', 'ts');
  o += text(125, 242, '第一层就把 8 个 character 压在一起', 'ts', 'middle');
  // 右：tree
  const X = 300;
  o += text(X + 125, 18, 'hierarchical：每层只合并相邻两个', 'tb', 'middle');
  row(X + 6, 196);
  const lv = [[], [], []];
  for (let i = 0; i < 4; i++) lv[0].push([X + 6 + i * 60 + 28, 150]);
  for (let i = 0; i < 2; i++) lv[1].push([X + 6 + i * 120 + 58, 104]);
  lv[2].push([X + 6 + 118, 58]);
  for (let i = 0; i < 4; i++) for (const k of [0, 1]) o += path(d([[X + 6 + (2 * i + k) * 30 + 13, 194], [lv[0][i][0], lv[0][i][1] + 9]]), 'mute');
  for (let i = 0; i < 2; i++) for (const k of [0, 1]) o += path(d([[lv[0][2 * i + k][0], lv[0][2 * i + k][1] - 9], [lv[1][i][0], lv[1][i][1] + 9]]), 'mute');
  for (const k of [0, 1]) o += path(d([[lv[1][k][0], lv[1][k][1] - 9], [lv[2][0][0], lv[2][0][1] + 9]]), 'mute');
  lv.forEach((L, j) => L.forEach(([x, y]) => (o += circle(x, y, 9, 'solid'))));
  o += arrow(lv[2][0][0], 49, lv[2][0][0], 32, 'ink', 6) + text(lv[2][0][0] + 10, 42, '预测 e', 'ts');
  o += text(X + 125, 242, '每个圆点：Linear(2 份 → h)、BatchNorm、tanh', 'ts', 'middle');
  o += line(280, 30, 280, 250, 'grid');
  return svg(560, 250, o, '左边 flat 的 MLP 把 8 个 character的 embedding 拼在一起一次送进 Linear；右边 hierarchical 的结构每层只合并相邻两组，三层之后汇成一个 vector');
}

// ---------- 第 6 站：用 lower-triangular 的 weight 做平均 ----------
function avg() {
  const T = 4;
  const x = [[1, 0], [3, 2], [-1, 4], [5, -2]];
  const wei = [];
  for (let i = 0; i < T; i++) { const r = []; for (let j = 0; j < T; j++) r.push(j <= i ? 1 / (i + 1) : 0); wei.push(r); }
  const out = wei.map((r) => [0, 1].map((c) => r.reduce((s, w, j) => s + w * x[j][c], 0)));
  const frac = (v) => (v === 0 ? '0' : v === 1 ? '1' : '1/' + Math.round(1 / v));
  const num = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : (v < 0 ? '−' : '') + Math.abs(v).toFixed(2)).replace('-', '−');
  let o = '';
  const grid = (x0, y0, M, cw, f, title, hl) => {
    o += text(x0 + (M[0].length * cw) / 2, y0 - 12, title, 'tb', 'middle');
    M.forEach((r, i) => r.forEach((v, j) => {
      const z = hl && j > i;
      o += rect(x0 + j * cw, y0 + i * 30, cw - 3, 27, z ? 'wash2' : hl ? 'wash' : 'paper', 3) + text(x0 + j * cw + (cw - 3) / 2, y0 + i * 30 + 18, f(v), z ? 'ts' : 't', 'middle');
    }));
  };
  grid(20, 46, wei, 44, frac, 'wei：T × T', true);
  o += text(206, 110, '@', 'tbig', 'middle');
  grid(226, 46, x, 40, num, 'x：T × C', false);
  o += text(328, 110, '=', 'tbig', 'middle');
  grid(350, 46, out, 52, num, 'out：T × C', false);
  ['t=1', 't=2', 't=3', 't=4'].forEach((s, i) => (o += text(462, 46 + i * 30 + 18, s, 'ts')));
  o += text(20, 190, '对角线右上方是 0：第 t 行只平均第 1 到 t 个 token，看不到后面的。', 'ts');
  o += text(20, 208, '例：第 3 行 = (1 + 3 − 1)/3, (0 + 2 + 4)/3 = (1, 2)。', 'ts');
  o += text(20, 226, 'wei 由 tril 加 masked_fill(−∞) 再 softmax 得到；self-attention 只是把全 0 的 score 换成 q·k。', 'ts');
  return svg(560, 232, o, 'Lower-triangular 的平均矩阵乘 T 乘 C 的 x：第 t 行 output 是前 t 个 token 的平均，例如第 3 行是 (1, 2)');
}

// ---------- 第 7 站：BPE 在 aaabdaaabac 上的三次 merge（动图） ----------
function bpeA() {
  const s = 'aaabdaaabac';
  let ids = [...s].map((c) => c.charCodeAt(0));
  const vocab = {};
  for (let i = 0; i < 256; i++) vocab[i] = String.fromCharCode(i);
  const frames = [{ ids: ids.slice(), note: '11 个 byte，每个 byte 一个 token', pair: null }];
  for (let k = 0; k < 3; k++) {
    const cnt = new Map();
    for (let i = 0; i + 1 < ids.length; i++) { const key = ids[i] + ',' + ids[i + 1]; cnt.set(key, (cnt.get(key) || 0) + 1); }
    let best = null, bc = -1;
    for (const [key, c] of cnt) if (c > bc) { best = key; bc = c; } // 和 minbpe 一样：并列时取最先出现的
    const [a, b] = best.split(',').map(Number), nid = 256 + k;
    vocab[nid] = vocab[a] + vocab[b];
    const nx = [];
    for (let i = 0; i < ids.length; ) { if (i + 1 < ids.length && ids[i] === a && ids[i + 1] === b) { nx.push(nid); i += 2; } else { nx.push(ids[i]); i += 1; } }
    frames.push({ ids: nx, note: `merge ${k + 1}：(${a}, ${b}) → ${nid}，即 “${vocab[nid]}”；pair count ${bc}，token 数 ${ids.length} → ${nx.length}`, pair: [a, b] });
    ids = nx;
  }
  const fr = 2.2, T = fr * frames.length + 1;
  const kt = frames.map((_, i) => (i * fr) / T).concat([1]);
  let o = '';
  const cw = 46;
  frames.forEach((F, f) => {
    const on = kt.map((_, q) => (Math.min(q, frames.length - 1) === f ? 1 : 0));
    let g = '';
    let x = 10;
    F.ids.forEach((id) => {
      const w = vocab[id].length * cw - 4;
      g += rect(x, 40, w, 40, id >= 256 ? 'solid' : 'paper', 4) + text(x + w / 2, 58, vocab[id], id >= 256 ? 'tw' : 'tb', 'middle') + text(x + w / 2, 74, String(id), id >= 256 ? 'tw' : 'ts', 'middle');
      x += w + 4;
    });
    g += text(10, 112, F.note, f ? 'tl' : 'ts');
    o += `<g opacity="${f ? 0 : 1}">${g}${anim('opacity', on, kt, T, true)}</g>`;
  });
  o += text(10, 20, '每个方块是一个 token，上面是它代表的 bytes，下面是 token id', 'ts');
  o += text(10, 140, 'merge 1 的 count 是 4，因为 “aaa” 里重叠的 (a, a) 数了两次；实际替换从左往右，只换掉 2 处。', 'ts');
  return svgA(560, 146, o, '动图：minbpe 的 BasicTokenizer 在 aaabdaaabac 上做三次 merge，token 从 11 个变成 9、7、5 个，最后是 258, 100, 258, 97, 99');
}

// ---------- 第 7 站：GPT-2 与 GPT-4 的 split pattern ----------
function split() {
  const s = '    if x == 12345:\n        return x';
  const gpt2 = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
  // GPT-4 pattern 里的 ?+ 和 ++ 是 possessive；对这两处来说去掉 possessive 结果不变（后面跟的 class 和前面的不相交）
  const gpt4 = /'(?:[sdmtSDMT]|[lL][lL]|[vV][eE]|[rR][eE])|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]|\s+(?!\S)|\s+/gu;
  const show = (t) => t.replace(/ /g, '·').replace(/\n/g, '↵');
  let o = text(10, 18, '同一段 code，两种 pre-tokenization（· 是空格，↵ 是换行）', 'tb');
  const draw = (re, y, lab) => {
    const parts = s.match(re);
    o += text(10, y - 8, lab + `：${parts.length} 块`, 'ts');
    let x = 10, yy = y;
    parts.forEach((p) => {
      const w = Math.max(16, show(p).length * 8.2 + 8);
      if (x + w > 556) { x = 10; yy += 34; }
      o += rect(x, yy, w, 26, /^\s+$/.test(p) ? 'wash2' : 'paper', 3) + text(x + w / 2, yy + 18, show(p), 't', 'middle');
      x += w + 4;
    });
    return yy;
  };
  let y = draw(gpt2, 52, 'GPT-2 pattern');
  y = draw(gpt4, y + 62, 'GPT-4 pattern');
  o += text(10, y + 48, 'GPT-4：数字最多 3 位一块；标点可以带上紧跟的换行；换行不再和下一行的缩进连成一块。', 'ts');
  return svg(560, y + 54, o, 'GPT-2 和 GPT-4 的 regex 对一段 Python code 的切分：GPT-4 把 12345 切成 123 和 45，把冒号和换行放在一起');
}

// ---------- 第 7 站：sentencepiece 的 vocabulary 排列与 byte fallback ----------
function spm() {
  // Colab（Llama 2 设置，vocab_size 400）里 sp.encode("hello 안녕하세요") 的结果：
  // 前 6 个 piece 和 id 直接取自 Colab 的 output；韩文部分由 UTF-8 byte 加 3 算出（3 个 special token 排在 byte token 前面）
  const head = [['▁', 362], ['h', 378], ['e', 361], ['l', 372], ['lo', 358], ['▁', 362]];
  const kor = [...'안녕하세요'];
  const enc = new TextEncoder();
  const groups = kor.map((ch) => [...enc.encode(ch)].map((b) => ['<0x' + b.toString(16).toUpperCase().padStart(2, '0') + '>', b + 3, b]));
  let o = '';
  // 1. vocabulary 的排列
  const V = 400, x0 = 10, x1 = 550, sx = lin(0, V, x0, x1), yb = 34;
  o += text(x0, 18, 'vocabulary 400 的排列（id 从左到右）', 'ts');
  o += rect(sx(0), yb, sx(3) - sx(0), 22, 'solid2') + rect(sx(3), yb, sx(259) - sx(3), 22, 'wash-strong') + rect(sx(259), yb, sx(V) - sx(259), 22, 'wash2');
  o += text((sx(3) + sx(259)) / 2, yb + 15, '256 个 byte token：id 3 到 258', 't', 'middle');
  o += text((sx(259) + sx(V)) / 2, yb + 15, 'merges，然后是单个 code point', 't', 'middle');
  o += text(sx(0), yb + 38, '0、1、2：<unk>、<s>、</s>'.replace(/</g, '&lt;').replace(/>/g, '&gt;'), 'ts');
  // 2. encode 的结果
  const box = (x, y, w, s, id, cls) => {
    const tc = cls === 'solid' ? 'tw' : 't', ic = cls === 'solid' ? 'tw' : 'ts';
    return rect(x, y, w, 40, cls, 4) + text(x + w / 2, y + 17, esc(s), tc, 'middle') + text(x + w / 2, y + 33, String(id), ic, 'middle');
  };
  const y1 = 110;
  o += text(x0, y1 - 12, 'sp.encode("hello 안녕하세요")：每个方块上面是 piece，下面是 token id', 'ts');
  let x = x0;
  head.forEach(([s, id]) => { const w = 38; o += box(x, y1, w, s, id, s === 'lo' ? 'solid' : 'paper'); x += w + 4; });
  o += text(x + 6, y1 + 17, '← 开头的 ▁ 是 add_dummy_prefix 加的', 'ts');
  o += text(x + 6, y1 + 33, '　 lo 是一次 merge，其余是单个 code point', 'ts');
  // 韩文：每个 syllable 3 个 byte token，分两行
  const bw = 54, gap = 4, rows = [groups.slice(0, 3), groups.slice(3)];
  let y = y1 + 78;
  rows.forEach((row) => {
    let xx = x0;
    row.forEach((g, gi) => {
      const ch = kor[groups.indexOf(g)];
      const gx0 = xx, gw = g.length * (bw + gap) - gap;
      o += path(d([[gx0, y - 6], [gx0, y - 10], [gx0 + gw, y - 10], [gx0 + gw, y - 6]]), 'mute');
      o += text(gx0 + gw / 2, y - 15, ch + '：UTF-8 ' + g.map((t) => t[2]).join(' '), 'ts', 'middle');
      g.forEach(([s, id]) => { o += box(xx, y, bw, s, id, 'wash-strong'); xx += bw + gap; });
      xx += 8;
    });
    y += 76;
  });
  o += text(x0, y - 20, '训练文本里没有韩文：每个 code point 都退回 UTF-8 byte，byte b 的 token id 是 b + 3。', 'ts');
  o += text(x0, y - 3, '关掉 byte_fallback 重训，这 15 个 token 会变成一个 <unk>（id 0）。'.replace(/</g, '&lt;').replace(/>/g, '&gt;'), 'ts');
  return svg(560, y + 4, o, 'sentencepiece 的 vocabulary：id 0 到 2 是 special token，3 到 258 是 256 个 byte token，之后是 merges 和单个 code point。hello 编成 ▁ h e l lo，韩文 안녕하세요 的 15 个 UTF-8 byte 各自变成一个 byte token，id 是 byte 加 3');
}

export default {
  'z2h-spm': spm,
  'z2h-graph': graphA,
  'z2h-fork': fork,
  'z2h-counts': counts,
  'z2h-onehot': onehot,
  'z2h-mlp': mlp,
  'z2h-sat': satA,
  'z2h-deep': deep,
  'z2h-bngraph': bngraph,
  'z2h-wavenet': wavenet,
  'z2h-avg': avg,
  'z2h-bpe': bpeA,
  'z2h-split': split,
};
