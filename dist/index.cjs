"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  configs: () => configs,
  default: () => src_default,
  jobNameMustBeConstantRule: () => jobNameMustBeConstantRule,
  jobOptionsMustSetAttemptsRule: () => jobOptionsMustSetAttemptsRule,
  noBlockingConcurrencyZeroRule: () => noBlockingConcurrencyZeroRule,
  queueOptionsMustSetRemoveOnCompleteRule: () => queueOptionsMustSetRemoveOnCompleteRule,
  queueOptionsMustSetRemoveOnFailRule: () => queueOptionsMustSetRemoveOnFailRule,
  rules: () => rules,
  workerMustImplementCloseRule: () => workerMustImplementCloseRule,
  workerMustListenFailedRule: () => workerMustListenFailedRule
});
module.exports = __toCommonJS(src_exports);

// src/configs/recommended.ts
var recommendedRules = {
  "bullmq/worker-must-implement-close": "error",
  "bullmq/worker-must-listen-failed": "error",
  "bullmq/job-name-must-be-constant": "error",
  "bullmq/queue-options-must-set-removeoncomplete": "error",
  "bullmq/queue-options-must-set-removeonfail": "error",
  "bullmq/job-options-must-set-attempts": "error",
  "bullmq/no-blocking-concurrency-zero": "error"
};

// src/rules/jobNameMustBeConstant.ts
var import_utils3 = require("@typescript-eslint/utils");

// src/utils/createRule.ts
var import_utils = require("@typescript-eslint/utils");
var createRule = import_utils.ESLintUtils.RuleCreator(
  (ruleName) => `https://github.com/agjs/eslint-plugin-bullmq/blob/main/docs/rules/${ruleName}.md`
);

// src/utils/bullmq.ts
var import_utils2 = require("@typescript-eslint/utils");
var BULLMQ_PACKAGE = "bullmq";
function analyzeBullmqImports(program) {
  const workerLocalNames = /* @__PURE__ */ new Set();
  const queueLocalNames = /* @__PURE__ */ new Set();
  const queueEventsLocalNames = /* @__PURE__ */ new Set();
  let hasBullmqImport = false;
  for (const stmt of program.body) {
    if (stmt.type !== import_utils2.AST_NODE_TYPES.ImportDeclaration) {
      continue;
    }
    if (stmt.source.value !== BULLMQ_PACKAGE) {
      continue;
    }
    hasBullmqImport = true;
    for (const specifier of stmt.specifiers) {
      if (specifier.type !== import_utils2.AST_NODE_TYPES.ImportSpecifier) {
        continue;
      }
      if (specifier.imported.type !== import_utils2.AST_NODE_TYPES.Identifier) {
        continue;
      }
      switch (specifier.imported.name) {
        case "Worker":
          workerLocalNames.add(specifier.local.name);
          break;
        case "Queue":
          queueLocalNames.add(specifier.local.name);
          break;
        case "QueueEvents":
          queueEventsLocalNames.add(specifier.local.name);
          break;
        default:
          break;
      }
    }
  }
  return {
    hasBullmqImport,
    workerLocalNames,
    queueLocalNames,
    queueEventsLocalNames
  };
}
function isNewWorker(node, imports) {
  if (node.type !== import_utils2.AST_NODE_TYPES.NewExpression) {
    return false;
  }
  if (node.callee.type !== import_utils2.AST_NODE_TYPES.Identifier) {
    return false;
  }
  if (imports.workerLocalNames.size === 0) {
    return node.callee.name === "Worker";
  }
  return imports.workerLocalNames.has(node.callee.name);
}
function isNewQueue(node, imports) {
  if (node.type !== import_utils2.AST_NODE_TYPES.NewExpression) {
    return false;
  }
  if (node.callee.type !== import_utils2.AST_NODE_TYPES.Identifier) {
    return false;
  }
  if (imports.queueLocalNames.size === 0) {
    return node.callee.name === "Queue";
  }
  return imports.queueLocalNames.has(node.callee.name);
}
function isQueueLikeReceiverName(name) {
  return /Queue$/.test(name);
}
function getReceiverKey(node) {
  if (node.type === import_utils2.AST_NODE_TYPES.Identifier) {
    return node.name;
  }
  if (node.type === import_utils2.AST_NODE_TYPES.MemberExpression && node.object.type === import_utils2.AST_NODE_TYPES.ThisExpression && node.property.type === import_utils2.AST_NODE_TYPES.Identifier) {
    return `this.${node.property.name}`;
  }
  return null;
}
function findEnclosingClass(node) {
  let current = node.parent;
  while (current) {
    if (current.type === import_utils2.AST_NODE_TYPES.ClassDeclaration || current.type === import_utils2.AST_NODE_TYPES.ClassExpression) {
      return current;
    }
    current = current.parent;
  }
  return null;
}
function findEnclosingFunctionOrClass(node) {
  let current = node.parent;
  while (current) {
    if (current.type === import_utils2.AST_NODE_TYPES.FunctionDeclaration || current.type === import_utils2.AST_NODE_TYPES.FunctionExpression || current.type === import_utils2.AST_NODE_TYPES.ArrowFunctionExpression || current.type === import_utils2.AST_NODE_TYPES.ClassDeclaration || current.type === import_utils2.AST_NODE_TYPES.ClassExpression) {
      return current;
    }
    current = current.parent;
  }
  return null;
}
function getOptionsObjectArg(call, index) {
  const arg = call.arguments[index];
  if (arg && arg.type === import_utils2.AST_NODE_TYPES.ObjectExpression) {
    return arg;
  }
  return null;
}
function findObjectProperty(obj, name) {
  for (const property of obj.properties) {
    if (property.type !== import_utils2.AST_NODE_TYPES.Property) {
      continue;
    }
    if (property.key.type === import_utils2.AST_NODE_TYPES.Identifier && property.key.name === name) {
      return property;
    }
    if (property.key.type === import_utils2.AST_NODE_TYPES.Literal && property.key.value === name) {
      return property;
    }
  }
  return null;
}
function collectQueueDefinitions(program, imports) {
  const out = /* @__PURE__ */ new Map();
  walkAll(program, (node) => {
    if (!isNewQueue(node, imports)) {
      return;
    }
    const def = {
      node,
      defaultJobOptions: extractDefaultJobOptions(node)
    };
    const owner = findOwningBindingKey(node);
    if (owner !== null) {
      out.set(owner, def);
    }
  });
  return out;
}
function extractDefaultJobOptions(newExpr) {
  const opts = getOptionsObjectArg(newExpr, 1);
  if (!opts) {
    return null;
  }
  const property = findObjectProperty(opts, "defaultJobOptions");
  if (!property) {
    return null;
  }
  if (property.value.type === import_utils2.AST_NODE_TYPES.ObjectExpression) {
    return property.value;
  }
  return null;
}
function findOwningBindingKey(node) {
  const parent = node.parent;
  if (!parent) {
    return null;
  }
  if (parent.type === import_utils2.AST_NODE_TYPES.VariableDeclarator && parent.id.type === import_utils2.AST_NODE_TYPES.Identifier) {
    return parent.id.name;
  }
  if (parent.type === import_utils2.AST_NODE_TYPES.PropertyDefinition) {
    if (parent.key.type === import_utils2.AST_NODE_TYPES.Identifier && !parent.computed) {
      return `this.${parent.key.name}`;
    }
    if (parent.key.type === import_utils2.AST_NODE_TYPES.Literal && typeof parent.key.value === "string") {
      return `this.${parent.key.value}`;
    }
  }
  if (parent.type === import_utils2.AST_NODE_TYPES.AssignmentExpression && parent.right === node) {
    const key = getReceiverKey(parent.left);
    if (key) {
      return key;
    }
  }
  return null;
}
function collectWorkerDefinitions(program, imports) {
  const out = [];
  walkAll(program, (node) => {
    if (!isNewWorker(node, imports)) {
      return;
    }
    out.push({
      node,
      bindingKey: findOwningBindingKey(node),
      enclosingClass: findEnclosingClass(node),
      enclosingFunctionOrClass: findEnclosingFunctionOrClass(node)
    });
  });
  return out;
}
function isQueueAddCall(call) {
  if (call.callee.type !== import_utils2.AST_NODE_TYPES.MemberExpression) {
    return false;
  }
  if (call.callee.property.type !== import_utils2.AST_NODE_TYPES.Identifier) {
    return false;
  }
  return call.callee.property.name === "add";
}
function getCallReceiverKey(call) {
  if (call.callee.type !== import_utils2.AST_NODE_TYPES.MemberExpression) {
    return null;
  }
  return getReceiverKey(call.callee.object);
}
function walkAll(root, visit) {
  const stack = [root];
  const visited = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);
    visit(current);
    for (const child of collectChildren(current)) {
      stack.push(child);
    }
  }
}
function walkSome(root, predicate) {
  const stack = [root];
  const visited = /* @__PURE__ */ new WeakSet();
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || visited.has(current)) {
      continue;
    }
    visited.add(current);
    if (predicate(current)) {
      return true;
    }
    for (const child of collectChildren(current)) {
      stack.push(child);
    }
  }
  return false;
}
function collectChildren(node) {
  const out = [];
  for (const [key, value] of Object.entries(
    node
  )) {
    if (key === "parent" || key === "loc" || key === "range" || key === "tokens" || key === "comments") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNodeLike(item)) {
          out.push(item);
        }
      }
      continue;
    }
    if (isNodeLike(value)) {
      out.push(value);
    }
  }
  return out;
}
function isNodeLike(value) {
  return typeof value === "object" && value !== null && "type" in value && typeof value.type === "string";
}

// src/rules/jobNameMustBeConstant.ts
var RULE_NAME = "job-name-must-be-constant";
var DEFAULT_QUEUE_NAME_PATTERN = "Queue$";
var optionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queueNamePattern: { type: "string", minLength: 1 }
  }
};
var jobNameMustBeConstantRule = createRule({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow string-literal job names in `<queue>.add(name, ...)` calls \u2014 pass a constant identifier or member access so producers, workers, and dashboards share one source of truth.",
      recommended: true
    },
    schema: [optionSchema],
    messages: {
      literalJobName: "Job name `{{value}}` is an inline string literal \u2014 pass a constant identifier (e.g., `JOB_NAMES.foo`) so producers, workers, and dashboards share one source of truth."
    }
  },
  defaultOptions: [{ queueNamePattern: DEFAULT_QUEUE_NAME_PATTERN }],
  create(context, [options]) {
    const queuePattern = compilePattern(
      options.queueNamePattern ?? DEFAULT_QUEUE_NAME_PATTERN
    );
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    let knownQueues = /* @__PURE__ */ new Map();
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
        knownQueues = collectQueueDefinitions(program, imports);
      },
      CallExpression(node) {
        if (!isQueueAddCall(node)) {
          return;
        }
        if (!receiverIsQueueLike(node, knownQueues, queuePattern)) {
          return;
        }
        const nameArg = node.arguments[0];
        if (!nameArg) {
          return;
        }
        if (nameArg.type === import_utils3.AST_NODE_TYPES.Literal && typeof nameArg.value === "string") {
          context.report({
            node: nameArg,
            messageId: "literalJobName",
            data: { value: nameArg.value }
          });
          return;
        }
        if (nameArg.type === import_utils3.AST_NODE_TYPES.TemplateLiteral && nameArg.expressions.length === 0 && nameArg.quasis.length > 0) {
          context.report({
            node: nameArg,
            messageId: "literalJobName",
            data: { value: nameArg.quasis[0]?.value.cooked ?? "" }
          });
        }
      }
    };
  }
});
function receiverIsQueueLike(call, knownQueues, queuePattern) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  if (knownQueues.has(key)) {
    return true;
  }
  if (!queuePattern) {
    return false;
  }
  const last = key.includes(".") ? key.split(".").pop() ?? key : key;
  return queuePattern.test(last) || isQueueLikeReceiverName(last);
}
function compilePattern(source) {
  try {
    return new RegExp(source);
  } catch {
    return null;
  }
}

// src/rules/jobOptionsMustSetAttempts.ts
var import_utils4 = require("@typescript-eslint/utils");
var RULE_NAME2 = "job-options-must-set-attempts";
var optionSchema2 = {
  type: "object",
  additionalProperties: false,
  properties: {
    requireBackoff: { type: "boolean" }
  }
};
var jobOptionsMustSetAttemptsRule = createRule({
  name: RULE_NAME2,
  meta: {
    type: "problem",
    docs: {
      description: "Every `<queue>.add(...)` must configure `attempts` (per-call or via `defaultJobOptions`); when `attempts > 1`, also require `backoff` so retries aren't tight loops.",
      recommended: true
    },
    schema: [optionSchema2],
    messages: {
      missingAttempts: "Job has no `attempts` configuration \u2014 failed jobs will not retry. Set `attempts` per-call or via `defaultJobOptions` on the Queue.",
      missingBackoff: "Job has `attempts > 1` but no `backoff` configuration \u2014 retries will fire back-to-back without delay, likely re-failing for the same reason. Add a `backoff` (e.g., `{ type: 'exponential', delay: 1000 }`)."
    }
  },
  defaultOptions: [{ requireBackoff: true }],
  create(context, [options]) {
    const requireBackoff = options.requireBackoff !== false;
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    let knownQueues = /* @__PURE__ */ new Map();
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
        knownQueues = collectQueueDefinitions(program, imports);
      },
      CallExpression(node) {
        if (!isQueueAddCall(node)) {
          return;
        }
        if (!receiverIsQueueLike2(node, knownQueues)) {
          return;
        }
        const attemptsValue = getEffectiveOptionValue(node, knownQueues, "attempts");
        if (!attemptsValue) {
          context.report({ node, messageId: "missingAttempts" });
          return;
        }
        if (!requireBackoff) {
          return;
        }
        if (isAttemptsLiteralOne(attemptsValue)) {
          return;
        }
        const backoffValue = getEffectiveOptionValue(node, knownQueues, "backoff");
        if (!backoffValue) {
          context.report({ node, messageId: "missingBackoff" });
        }
      }
    };
  }
});
function getEffectiveOptionValue(call, knownQueues, name) {
  const opts = getOptionsObjectArg(call, 2);
  if (opts) {
    const property = findObjectProperty(opts, name);
    if (property) {
      return property.value;
    }
  }
  const key = getCallReceiverKey(call);
  if (!key) {
    return null;
  }
  const def = knownQueues.get(key);
  if (!def?.defaultJobOptions) {
    return null;
  }
  const defaultProperty = findObjectProperty(def.defaultJobOptions, name);
  if (!defaultProperty) {
    return null;
  }
  return defaultProperty.value;
}
function isAttemptsLiteralOne(value) {
  return value.type === import_utils4.AST_NODE_TYPES.Literal && typeof value.value === "number" && value.value === 1;
}
function receiverIsQueueLike2(call, knownQueues) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  if (knownQueues.has(key)) {
    return true;
  }
  const last = key.includes(".") ? key.split(".").pop() ?? key : key;
  return isQueueLikeReceiverName(last);
}

// src/rules/noBlockingConcurrencyZero.ts
var import_utils5 = require("@typescript-eslint/utils");
var RULE_NAME3 = "no-blocking-concurrency-zero";
var optionSchema3 = {
  type: "object",
  additionalProperties: false,
  properties: {}
};
var noBlockingConcurrencyZeroRule = createRule({
  name: RULE_NAME3,
  meta: {
    type: "problem",
    docs: {
      description: "Disallow `new Worker(name, processor, { concurrency: <numericLiteral \u2264 0> })` \u2014 non-positive concurrency blocks job processing entirely.",
      recommended: true
    },
    schema: [optionSchema3],
    messages: {
      invalidConcurrency: "Worker concurrency must be \u2265 1 \u2014 `{{value}}` would block job processing entirely. Use a positive integer or read from configuration."
    }
  },
  defaultOptions: [{}],
  create(context) {
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
      },
      NewExpression(node) {
        if (!isNewWorker(node, imports)) {
          return;
        }
        const opts = getOptionsObjectArg(node, 2);
        if (!opts) {
          return;
        }
        const concurrency = findObjectProperty(opts, "concurrency");
        if (!concurrency) {
          return;
        }
        const value = concurrency.value;
        if (value.type === import_utils5.AST_NODE_TYPES.Literal && typeof value.value === "number" && value.value <= 0) {
          context.report({
            node: value,
            messageId: "invalidConcurrency",
            data: { value: String(value.value) }
          });
          return;
        }
        if (value.type === import_utils5.AST_NODE_TYPES.UnaryExpression && value.operator === "-" && value.argument.type === import_utils5.AST_NODE_TYPES.Literal && typeof value.argument.value === "number" && value.argument.value > 0) {
          context.report({
            node: value,
            messageId: "invalidConcurrency",
            data: { value: `-${value.argument.value}` }
          });
        }
      }
    };
  }
});

// src/rules/queueOptionsMustSetRemoveOnComplete.ts
var RULE_NAME4 = "queue-options-must-set-removeoncomplete";
var optionSchema4 = {
  type: "object",
  additionalProperties: false,
  properties: {}
};
var queueOptionsMustSetRemoveOnCompleteRule = createRule({
  name: RULE_NAME4,
  meta: {
    type: "problem",
    docs: {
      description: "Every `<queue>.add(...)` must configure `removeOnComplete` (per-call or via the queue's `defaultJobOptions`) so completed jobs don't accumulate in Redis indefinitely.",
      recommended: true
    },
    schema: [optionSchema4],
    messages: {
      missingRemoveOnComplete: "Job has no `removeOnComplete` configuration \u2014 completed jobs accumulate in Redis indefinitely. Set it per-call or via `defaultJobOptions` on the Queue."
    }
  },
  defaultOptions: [{}],
  create(context) {
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    let knownQueues = /* @__PURE__ */ new Map();
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
        knownQueues = collectQueueDefinitions(program, imports);
      },
      CallExpression(node) {
        if (!isQueueAddCall(node)) {
          return;
        }
        if (!receiverIsQueueLike3(node, knownQueues)) {
          return;
        }
        if (callHasOption(node, "removeOnComplete")) {
          return;
        }
        if (queueDefaultsHaveOption(node, knownQueues, "removeOnComplete")) {
          return;
        }
        context.report({ node, messageId: "missingRemoveOnComplete" });
      }
    };
  }
});
function receiverIsQueueLike3(call, knownQueues) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  if (knownQueues.has(key)) {
    return true;
  }
  const last = key.includes(".") ? key.split(".").pop() ?? key : key;
  return isQueueLikeReceiverName(last);
}
function callHasOption(call, name) {
  const opts = getOptionsObjectArg(call, 2);
  if (!opts) {
    return false;
  }
  return findObjectProperty(opts, name) !== null;
}
function queueDefaultsHaveOption(call, knownQueues, name) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  const def = knownQueues.get(key);
  if (!def?.defaultJobOptions) {
    return false;
  }
  return findObjectProperty(def.defaultJobOptions, name) !== null;
}

// src/rules/queueOptionsMustSetRemoveOnFail.ts
var RULE_NAME5 = "queue-options-must-set-removeonfail";
var optionSchema5 = {
  type: "object",
  additionalProperties: false,
  properties: {}
};
var queueOptionsMustSetRemoveOnFailRule = createRule({
  name: RULE_NAME5,
  meta: {
    type: "problem",
    docs: {
      description: "Every `<queue>.add(...)` must configure `removeOnFail` (per-call or via the queue's `defaultJobOptions`) so failed jobs don't accumulate in Redis indefinitely.",
      recommended: true
    },
    schema: [optionSchema5],
    messages: {
      missingRemoveOnFail: "Job has no `removeOnFail` configuration \u2014 failed jobs accumulate in Redis indefinitely. Set it per-call or via `defaultJobOptions` on the Queue."
    }
  },
  defaultOptions: [{}],
  create(context) {
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    let knownQueues = /* @__PURE__ */ new Map();
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
        knownQueues = collectQueueDefinitions(program, imports);
      },
      CallExpression(node) {
        if (!isQueueAddCall(node)) {
          return;
        }
        if (!receiverIsQueueLike4(node, knownQueues)) {
          return;
        }
        if (callHasOption2(node, "removeOnFail")) {
          return;
        }
        if (queueDefaultsHaveOption2(node, knownQueues, "removeOnFail")) {
          return;
        }
        context.report({ node, messageId: "missingRemoveOnFail" });
      }
    };
  }
});
function receiverIsQueueLike4(call, knownQueues) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  if (knownQueues.has(key)) {
    return true;
  }
  const last = key.includes(".") ? key.split(".").pop() ?? key : key;
  return isQueueLikeReceiverName(last);
}
function callHasOption2(call, name) {
  const opts = getOptionsObjectArg(call, 2);
  if (!opts) {
    return false;
  }
  return findObjectProperty(opts, name) !== null;
}
function queueDefaultsHaveOption2(call, knownQueues, name) {
  const key = getCallReceiverKey(call);
  if (!key) {
    return false;
  }
  const def = knownQueues.get(key);
  if (!def?.defaultJobOptions) {
    return false;
  }
  return findObjectProperty(def.defaultJobOptions, name) !== null;
}

// src/rules/workerMustImplementClose.ts
var import_utils6 = require("@typescript-eslint/utils");
var RULE_NAME6 = "worker-must-implement-close";
var DEFAULT_CLOSE_METHODS = [
  "close",
  "shutdown",
  "dispose",
  "onModuleDestroy"
];
var optionSchema6 = {
  type: "object",
  additionalProperties: false,
  properties: {
    closeMethodNames: {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
      minItems: 1
    }
  }
};
var workerMustImplementCloseRule = createRule({
  name: RULE_NAME6,
  meta: {
    type: "problem",
    docs: {
      description: "Classes that own a `new Worker(...)` instance must declare a close-equivalent method so workers can be drained during graceful shutdown.",
      recommended: true
    },
    schema: [optionSchema6],
    messages: {
      missingClose: "Class '{{name}}' owns a `new Worker(...)` instance but does not declare a close method ({{methods}}). BullMQ workers must be explicitly closed during graceful shutdown \u2014 otherwise jobs in flight are abandoned and Redis connections leak."
    }
  },
  defaultOptions: [{ closeMethodNames: [...DEFAULT_CLOSE_METHODS] }],
  create(context, [options]) {
    const closeMethods = new Set(
      options.closeMethodNames ?? DEFAULT_CLOSE_METHODS
    );
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
      },
      ClassDeclaration(node) {
        if (!imports.hasBullmqImport) {
          return;
        }
        if (!classOwnsWorker(node, imports)) {
          return;
        }
        if (classDeclaresAnyMethod(node, closeMethods)) {
          return;
        }
        const className = node.id?.name ?? "<anonymous>";
        const methodList = [...closeMethods].map((m) => `\`${m}\``).join(", ");
        context.report({
          node: node.id ?? node,
          messageId: "missingClose",
          data: { name: className, methods: methodList }
        });
      }
    };
  }
});
function classOwnsWorker(cls, imports) {
  for (const member of cls.body.body) {
    if (member.type === import_utils6.AST_NODE_TYPES.PropertyDefinition && member.value && isNewWorker(member.value, imports)) {
      return true;
    }
    if (member.type === import_utils6.AST_NODE_TYPES.MethodDefinition) {
      const fnBody = member.value.body;
      if (!fnBody) {
        continue;
      }
      const found = walkSome(fnBody, (n) => {
        if (n.type !== import_utils6.AST_NODE_TYPES.AssignmentExpression) {
          return false;
        }
        if (n.left.type !== import_utils6.AST_NODE_TYPES.MemberExpression || n.left.object.type !== import_utils6.AST_NODE_TYPES.ThisExpression) {
          return false;
        }
        return isNewWorker(n.right, imports);
      });
      if (found) {
        return true;
      }
    }
  }
  return false;
}
function classDeclaresAnyMethod(cls, methodNames) {
  for (const member of cls.body.body) {
    if (member.type !== import_utils6.AST_NODE_TYPES.MethodDefinition) {
      continue;
    }
    if (member.kind === "constructor") {
      continue;
    }
    const name = getMethodName(member);
    if (name && methodNames.has(name)) {
      return true;
    }
  }
  return false;
}
function getMethodName(method) {
  if (method.key.type === import_utils6.AST_NODE_TYPES.Identifier) {
    return method.key.name;
  }
  if (method.key.type === import_utils6.AST_NODE_TYPES.Literal && typeof method.key.value === "string") {
    return method.key.value;
  }
  return null;
}

// src/rules/workerMustListenFailed.ts
var import_utils7 = require("@typescript-eslint/utils");
var RULE_NAME7 = "worker-must-listen-failed";
var DEFAULT_REQUIRED_EVENTS = ["failed"];
var optionSchema7 = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredEvents: {
      type: "array",
      items: { type: "string" },
      uniqueItems: true,
      minItems: 1
    }
  }
};
var workerMustListenFailedRule = createRule({
  name: RULE_NAME7,
  meta: {
    type: "problem",
    docs: {
      description: "Every `new Worker(...)` must register listeners for required events (default `failed`) \u2014 BullMQ failures are silent unless explicitly subscribed.",
      recommended: true
    },
    schema: [optionSchema7],
    messages: {
      missingListener: "Worker assigned to `{{name}}` has no `.on('{{event}}', ...)` listener \u2014 BullMQ failures are silent unless explicitly subscribed."
    }
  },
  defaultOptions: [{ requiredEvents: [...DEFAULT_REQUIRED_EVENTS] }],
  create(context, [options]) {
    const requiredEvents = options.requiredEvents ?? DEFAULT_REQUIRED_EVENTS;
    let imports = {
      hasBullmqImport: false,
      workerLocalNames: /* @__PURE__ */ new Set(),
      queueLocalNames: /* @__PURE__ */ new Set(),
      queueEventsLocalNames: /* @__PURE__ */ new Set()
    };
    let workers = [];
    let listenerKeyEventPairs = /* @__PURE__ */ new Set();
    return {
      Program(program) {
        imports = analyzeBullmqImports(program);
        if (!imports.hasBullmqImport) {
          return;
        }
        workers = collectWorkerDefinitions(program, imports);
        listenerKeyEventPairs = collectOnListeners(program);
      },
      "Program:exit"() {
        if (!imports.hasBullmqImport) {
          return;
        }
        for (const worker of workers) {
          const bindingKey = worker.bindingKey;
          if (!bindingKey) {
            continue;
          }
          for (const event of requiredEvents) {
            const key = `${bindingKey}::${event}`;
            if (!listenerKeyEventPairs.has(key)) {
              context.report({
                node: worker.node,
                messageId: "missingListener",
                data: { name: bindingKey, event }
              });
            }
          }
        }
      }
    };
  }
});
function collectOnListeners(program) {
  const pairs = /* @__PURE__ */ new Set();
  walkAll(program, (node) => {
    if (node.type !== import_utils7.AST_NODE_TYPES.CallExpression) {
      return;
    }
    if (node.callee.type !== import_utils7.AST_NODE_TYPES.MemberExpression || node.callee.property.type !== import_utils7.AST_NODE_TYPES.Identifier || node.callee.property.name !== "on") {
      return;
    }
    const receiverKey = getReceiverKey(node.callee.object);
    if (!receiverKey) {
      return;
    }
    const eventArg = node.arguments[0];
    if (!eventArg || eventArg.type !== import_utils7.AST_NODE_TYPES.Literal || typeof eventArg.value !== "string") {
      return;
    }
    pairs.add(`${receiverKey}::${eventArg.value}`);
  });
  return pairs;
}

// src/rules/index.ts
var rules = {
  "worker-must-implement-close": workerMustImplementCloseRule,
  "worker-must-listen-failed": workerMustListenFailedRule,
  "job-name-must-be-constant": jobNameMustBeConstantRule,
  "queue-options-must-set-removeoncomplete": queueOptionsMustSetRemoveOnCompleteRule,
  "queue-options-must-set-removeonfail": queueOptionsMustSetRemoveOnFailRule,
  "job-options-must-set-attempts": jobOptionsMustSetAttemptsRule,
  "no-blocking-concurrency-zero": noBlockingConcurrencyZeroRule
};

// src/index.ts
var plugin = {
  meta: {
    name: "eslint-plugin-bullmq",
    version: "0.1.0"
  },
  rules,
  configs: {}
};
plugin.configs.recommended = {
  plugins: {
    bullmq: plugin
  },
  rules: recommendedRules
};
var configs = plugin.configs;
var src_default = plugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  configs,
  jobNameMustBeConstantRule,
  jobOptionsMustSetAttemptsRule,
  noBlockingConcurrencyZeroRule,
  queueOptionsMustSetRemoveOnCompleteRule,
  queueOptionsMustSetRemoveOnFailRule,
  rules,
  workerMustImplementCloseRule,
  workerMustListenFailedRule
});
