export const problems = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: [
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    ],
    examples: [
      {
        title: "Example 1",
        content: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] == 9",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "Only one valid answer exists",
    ],

    starterCode: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
    }
};`
    },

    driverCode: {
      cpp: `#include <iostream>
#include <vector>

using namespace std;

{{USER_CODE}}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    int target;
    cin >> target;

    Solution solver;
    vector<int> ans = solver.twoSum(nums, target);

    for (size_t i = 0; i < ans.size(); i++) {
        cout << ans[i] << (i + 1 < ans.size() ? " " : "");
    }
    cout << endl;
    return 0;
}`
    },

    testCases: [
      {
        input: "2\n2 7\n9",
        expectedOutput: "0 1",
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
      },
    ],
  },
  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: [
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      "An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
    ],
    examples: [
      {
        title: "Example 1",
        content: "Input: s = \"()\"\nOutput: true",
      },
      {
        title: "Example 2",
        content: "Input: s = \"(]\"\nOutput: false",
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only: '(', ')', '{', '}', '[' and ']'",
    ],

    starterCode: {
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
    }
};`,
    },

    driverCode: {
      cpp: `#include <iostream>
#include <string>
#include <stack>
#include <vector>
#include <unordered_map>

using namespace std;

{{USER_CODE}}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    string s;
    cin >> s;

    Solution solver;
    bool ans = solver.isValid(s);

    cout << (ans ? "true" : "false") << endl;
    return 0;
}`,
    },

    testCases: [
      {
        input: "2\n()",
        expectedOutput: "true",
      },
      {
        input: "4\n()[]",
        expectedOutput: "true",
      },
      {
        input: "2\n(]",
        expectedOutput: "false",
      },
    ],
  },
};
export function getRandomProblem() {
  const ids = Object.keys(problems);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  return problems[randomId];
}