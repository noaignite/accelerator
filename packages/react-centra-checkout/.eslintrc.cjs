/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/react.js'],
  rules: {
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ]
  }
}
