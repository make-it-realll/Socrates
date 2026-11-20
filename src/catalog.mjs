// 全部课程的目录：谱系（line）、简称、官方课名、先修关系。
// 先修关系取自 NUSMods AY2026/27 的 prerequisite 字段（只保留本目录内的课）；
// kind: 'content' 的边不是官方先修，而是"内容上接着讲"的关系。

export const lines = [
  { id: 'prob', name: '概率与统计', color: '#C2334D', dark: '#F0718A' },
  { id: 'num', name: '线代与数值', color: '#2B67B1', dark: '#6FA8EC' },
  { id: 'ana', name: '分析与方程', color: '#6A4BA6', dark: '#A98DE0' },
  { id: 'sys', name: '计算机系统', color: '#4A5560', dark: '#A3AFBB' },
  { id: 'ml', name: '机器学习', color: '#C77700', dark: '#F0A93B' },
  { id: 'ds', name: '数据科学实践', color: '#AE3F93', dark: '#E07CC6' },
  { id: 'sig', name: '信号·控制·机器人', color: '#0B8474', dark: '#3CC4B1' },
  { id: 'geo', name: '大气·海洋·流体', color: '#0A8DB0', dark: '#4CC3E3' },
  { id: 'fin', name: '金融数学', color: '#6F7F1E', dark: '#B4C653' },
];

// [code, 简称, official title, line]
const C = [
  ['ST2131', '概率', 'Probability', 'prob'],
  ['ST2334', '概率与统计', 'Probability and Statistics', 'prob'],
  ['ST2132', '数理统计', 'Mathematical Statistics', 'prob'],
  ['ST2137', '统计计算', 'Statistical Computing and Programming', 'prob'],
  ['ST3131', '回归分析', 'Regression Analysis', 'prob'],
  ['ST3232', '实验设计', 'Design & Analysis of Experiments', 'prob'],
  ['ST3236', '随机过程 I', 'Stochastic Processes I', 'prob'],
  ['MA3238', '随机过程 I', 'Stochastic Processes I', 'prob'],
  ['ST3239', '抽样调查', 'Survey Methodology', 'prob'],
  ['ST3244', '人口统计', 'Demographic Methods', 'prob'],
  ['ST3246', '精算损失模型', 'Statistical Models for Actuarial Science', 'prob'],
  ['ST3247', '随机模拟', 'Simulation', 'prob'],
  ['ST3248', '统计学习 I', 'Statistical Learning I', 'prob'],
  ['DSA4211', '高维统计', 'High-Dimensional Statistical Analysis', 'prob'],

  ['MA2101', '线性代数 II', 'Linear Algebra II', 'num'],
  ['DSA2102', '数值计算', 'Essential Data Analytics Tools: Numerical Computation', 'num'],
  ['DSA3102', '凸优化', 'Essential Data Analytics Tools: Convex Optimisation', 'num'],
  ['MA4230', '矩阵计算', 'Matrix Computation', 'num'],
  ['MA4270', '数据建模与计算', 'Data Modelling and Computation', 'num'],
  ['MA4255', '微分方程数值解', 'Numerical Methods in Differential Equations', 'num'],
  ['DSA4212', '大规模优化', 'Optimisation for Large-Scale Data-Driven Inference', 'num'],
  ['MA5232', '建模与数值模拟', 'Modeling and Numerical Simulations', 'num'],

  ['MA2108', '数学分析 I', 'Mathematical Analysis I', 'ana'],
  ['MA3211', '复分析 I', 'Complex Analysis I', 'ana'],
  ['MA3220', '常微分方程', 'Ordinary Differential Equations', 'ana'],
  ['MA3264', '数学建模', 'Mathematical Modelling', 'ana'],
  ['MA4221', '偏微分方程', 'Partial Differential Equations', 'ana'],
  ['MA4229', 'Fourier 分析与逼近', 'Fourier Analysis and Approximation', 'ana'],
  ['MA4233', '动力系统', 'Dynamical Systems', 'ana'],
  ['MA4198', '数学毕业项目', 'Mathematics Capstone Project', 'ana'],

  ['CS2030', '程序设计方法 II', 'Programming Methodology II', 'sys'],
  ['CS2040', '数据结构与算法', 'Data Structures and Algorithms', 'sys'],
  ['CS2100', '计算机组成', 'Computer Organisation', 'sys'],
  ['CS2102', '数据库', 'Database Systems', 'sys'],
  ['CS2103', '软件工程', 'Software Engineering', 'sys'],
  ['CS2105', '计算机网络', 'Introduction to Computer Networks', 'sys'],
  ['CS2106', '操作系统', 'Introduction to Operating Systems', 'sys'],
  ['CS3210', '并行计算', 'Parallel Computing', 'sys'],
  ['CS3241', '计算机图形学', 'Computer Graphics', 'sys'],
  ['CS4225', '大数据系统', 'Big Data Systems for Data Science', 'sys'],

  ['CS2109S', 'AI 与机器学习入门', 'Introduction to AI and Machine Learning', 'ml'],
  ['CS3244', '机器学习', 'Machine Learning', 'ml'],
  ['CS4248', '大语言模型', 'Introduction to Large Language Models', 'ml'],
  ['CS4277', '三维视觉', '3D Computer Vision', 'ml'],
  ['DSA4213', '自然语言处理', 'Natural Language Processing for Data Science', 'ml'],

  ['DSA2101', '数据可视化', 'Essential Data Analytics Tools: Data Visualisation', 'ds'],
  ['DSA2111', '云端数据科学', 'Cloud-Based Data Science and Programming', 'ds'],
  ['DSA2112', '数据管线里的 AI', 'Practical AI for Data Science Pipelines', 'ds'],
  ['DSA3101', '数据科学实践', 'Data Science in Practice', 'ds'],
  ['DSA426x', '案例分析', 'Sense-making Case Analysis (DSA4262–4266)', 'ds'],
  ['DSA4288', '荣誉项目', 'Honours Project in Data Science and Analytics', 'ds'],

  ['EE2012', '概率与复变', 'Analytical Methods in Electrical and Computer Engineering', 'sig'],
  ['EE2023', '信号与系统', 'Signals and Systems', 'sig'],
  ['EE3331C', '反馈控制', 'Feedback Control Systems', 'sig'],
  ['EE3731C', '信号分析', 'Signal Analytics', 'sig'],
  ['EE3305', '机器人系统设计', 'Robotic System Design', 'sig'],
  ['EE4308', '自主机器人', 'Autonomous Robot Systems', 'sig'],
  ['EE4309', '机器人感知', 'Robot Perception', 'sig'],
  ['EE4212', '计算机视觉', 'Computer Vision', 'sig'],
  ['EE4314', '制导·导航·控制', 'Eyes from above: Guidance, Navigation and Control', 'sig'],

  ['PC2135', '热力学与统计力学', 'Thermodynamics and Statistical Mechanics', 'geo'],
  ['GE2208', '天气与气候入门', 'Too Hot to Handle: Understanding our Weather & Climate', 'geo'],
  ['PC3238', '流体力学', 'Fluid Dynamics', 'geo'],
  ['PC3442', '天气与气候基础', 'Weather and Climate Fundamentals', 'geo'],
  ['PC3441', '气象数值方法', 'Numerical Methods for Meteorology', 'geo'],
  ['CE3132', '水文与明渠流', 'Hydrology and Free Surface Flows', 'geo'],
  ['PC4262', '遥感', 'Remote Sensing', 'geo'],
  ['PC4441', '气候科学', 'Climate Science and Climate Change Fundamentals', 'geo'],
  ['ME4233', '计算流体力学', 'Computational Methods In Fluid Mechanics', 'geo'],
  ['CCS5201', '气候模式', 'Introduction to Climate Modelling', 'geo'],

  ['QF2104', '定量金融基础', 'Fundamentals of Quantitative Finance', 'fin'],
  ['QF2103', '金融计算', 'Computing with AI for Quantitative Finance', 'fin'],
  ['QF3101', '投资工具与风险管理', 'Investment Instruments and Risk Management', 'fin'],
  ['QF3103', '金融高等数学', 'Advanced Mathematics in Quantitative Finance', 'fin'],
];

export const courses = C.map(([code, zh, title, line]) => ({ code, zh, title, line }));

// 官方先修（NUSMods）
const P = {
  DSA2101: ['ST2131'], DSA3101: ['DSA2101', 'ST2132'], DSA4211: ['ST3131'], DSA4212: ['ST2132'],
  DSA4213: ['ST2137', 'CS2040'], DSA4288: ['DSA3101', 'DSA3102', 'CS3244', 'ST3131'],
  CS2102: ['CS2030', 'CS2040'], CS2103: ['CS2030', 'CS2040'], CS2105: ['CS2040'], CS2106: ['CS2100'],
  CS2109S: ['CS2040'], CS3210: ['CS2100'], CS3241: ['CS2030', 'CS2040'], CS3244: ['CS2040', 'ST2131'],
  CS4225: ['CS2102'], CS4248: ['CS2109S', 'CS3244'], CS4277: ['CS2040'],
  MA3211: ['MA2108'], MA3220: ['MA2108'], MA3238: ['ST2131'], MA3264: ['MA2108'], MA4221: ['MA3220'],
  MA4229: ['MA2101', 'MA2108'], MA4230: ['MA2101', 'DSA2102'], MA4255: ['DSA2102', 'MA3220'],
  MA4270: ['DSA2102', 'ST2131'], MA5232: ['MA3264'], PC4441: ['PC3442'],
  ST2132: ['ST2131'], ST2137: ['ST2131'], ST3131: ['ST2132'], ST3232: ['ST2132'], ST3236: ['ST2131'],
  ST3239: ['ST2131'], ST3244: ['ST2131'], ST3246: ['ST2132'], ST3247: ['ST2131'], ST3248: ['ST2132'],
  QF2103: ['QF2104'], QF2104: ['ST2131'], QF3101: ['QF2104'], QF3103: ['ST2131'],
  EE3331C: ['EE2023'], EE3731C: ['EE2012', 'EE2023'], EE4308: ['EE3331C'], EE4309: ['EE3731C'],
  EE4212: ['EE3731C'],
};
// 内容延续（非官方先修）
const K = {
  DSA2102: ['MA2101'], DSA3102: ['MA2101'], DSA426x: ['DSA3101'], DSA2112: ['DSA2111'],
  PC3442: ['PC2135', 'GE2208'], PC3441: ['PC3442', 'PC3238'], ME4233: ['PC3238'], CE3132: ['PC3238'],
  CCS5201: ['PC4441', 'PC3441'], PC4262: ['PC2135'], MA4233: ['MA3220'], EE4314: ['EE3331C'],
  EE3305: [], MA4198: ['MA3264'], ST3248: ['ST3131'], DSA4212: ['DSA3102'],
};

export const edges = [];
for (const [to, froms] of Object.entries(P)) for (const from of froms) edges.push({ from, to, kind: 'prereq' });
for (const [to, froms] of Object.entries(K)) for (const from of froms) edges.push({ from, to, kind: 'content' });
