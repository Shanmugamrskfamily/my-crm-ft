// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@exodus/bytes|isomorphic-dompurify|dompurify|html-encoding-sniffer|@ant-design/colors|@ant-design/icons|@ant-design/cssinjs|@ant-design/cssinjs-utils|antd|rc-util|rc-picker|rc-pagination|rc-select|rc-tree|rc-table|rc-input|rc-motion|rc-notification|rc-tooltip|rc-dropdown|rc-menu|rc-checkbox|rc-radio|rc-tabs|rc-cascader|rc-collapse|rc-dialog|rc-drawer|rc-field-form|rc-image|rc-mentions|rc-overflow|rc-progress|rc-rate|rc-resize-observer|rc-segmented|rc-slider|rc-steps|rc-switch|rc-textarea|rc-tree-select|rc-trigger|rc-upload|rc-virtual-list|rc-input-number|@babel/runtime|@rc-component)/)",
  ],
};

module.exports = createJestConfig(customJestConfig);