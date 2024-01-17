import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  transform:{},
  projects:[
    {
      displayName:'jest-learning1',
      testMatch:[
        // 不能用相对路径
        '<rootDir>/learning-demo/jest-learning/dist/__tests__/**'
      ]
  }
  ]
};

export default config;