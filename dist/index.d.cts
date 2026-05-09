import { TSESLint } from '@typescript-eslint/utils';
import * as _typescript_eslint_utils_ts_eslint from '@typescript-eslint/utils/ts-eslint';

interface BullmqRuleDocs {
    readonly description: string;
    readonly recommended?: boolean;
}

interface NoBlockingConcurrencyZeroOptions {
}
type RuleOptions$6 = [NoBlockingConcurrencyZeroOptions];
declare const noBlockingConcurrencyZeroRule: _typescript_eslint_utils_ts_eslint.RuleModule<"invalidConcurrency", RuleOptions$6, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface JobOptionsMustSetAttemptsOptions {
    readonly requireBackoff?: boolean;
}
type RuleOptions$5 = [JobOptionsMustSetAttemptsOptions];
type MessageIds = "missingAttempts" | "missingBackoff";
declare const jobOptionsMustSetAttemptsRule: _typescript_eslint_utils_ts_eslint.RuleModule<MessageIds, RuleOptions$5, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface QueueOptionsMustSetRemoveOnFailOptions {
}
type RuleOptions$4 = [QueueOptionsMustSetRemoveOnFailOptions];
declare const queueOptionsMustSetRemoveOnFailRule: _typescript_eslint_utils_ts_eslint.RuleModule<"missingRemoveOnFail", RuleOptions$4, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface QueueOptionsMustSetRemoveOnCompleteOptions {
}
type RuleOptions$3 = [QueueOptionsMustSetRemoveOnCompleteOptions];
declare const queueOptionsMustSetRemoveOnCompleteRule: _typescript_eslint_utils_ts_eslint.RuleModule<"missingRemoveOnComplete", RuleOptions$3, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface JobNameMustBeConstantOptions {
    readonly queueNamePattern?: string;
}
type RuleOptions$2 = [JobNameMustBeConstantOptions];
declare const jobNameMustBeConstantRule: _typescript_eslint_utils_ts_eslint.RuleModule<"literalJobName", RuleOptions$2, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface WorkerMustListenFailedOptions {
    readonly requiredEvents?: readonly string[];
}
type RuleOptions$1 = [WorkerMustListenFailedOptions];
declare const workerMustListenFailedRule: _typescript_eslint_utils_ts_eslint.RuleModule<"missingListener", RuleOptions$1, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

interface WorkerMustImplementCloseOptions {
    readonly closeMethodNames?: readonly string[];
}
type RuleOptions = [WorkerMustImplementCloseOptions];
declare const workerMustImplementCloseRule: _typescript_eslint_utils_ts_eslint.RuleModule<"missingClose", RuleOptions, BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;

declare const rules: {
    "worker-must-implement-close": _typescript_eslint_utils_ts_eslint.RuleModule<"missingClose", [WorkerMustImplementCloseOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "worker-must-listen-failed": _typescript_eslint_utils_ts_eslint.RuleModule<"missingListener", [WorkerMustListenFailedOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "job-name-must-be-constant": _typescript_eslint_utils_ts_eslint.RuleModule<"literalJobName", [JobNameMustBeConstantOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "queue-options-must-set-removeoncomplete": _typescript_eslint_utils_ts_eslint.RuleModule<"missingRemoveOnComplete", [QueueOptionsMustSetRemoveOnCompleteOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "queue-options-must-set-removeonfail": _typescript_eslint_utils_ts_eslint.RuleModule<"missingRemoveOnFail", [QueueOptionsMustSetRemoveOnFailOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "job-options-must-set-attempts": _typescript_eslint_utils_ts_eslint.RuleModule<"missingAttempts" | "missingBackoff", [JobOptionsMustSetAttemptsOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
    "no-blocking-concurrency-zero": _typescript_eslint_utils_ts_eslint.RuleModule<"invalidConcurrency", [NoBlockingConcurrencyZeroOptions], BullmqRuleDocs, _typescript_eslint_utils_ts_eslint.RuleListener>;
};

type BullmqPlugin = TSESLint.FlatConfig.Plugin & {
    configs: Record<string, TSESLint.FlatConfig.Config>;
};
declare const plugin: BullmqPlugin;

declare const configs: TSESLint.FlatConfig.SharedConfigs & Record<string, TSESLint.FlatConfig.Config>;

export { configs, plugin as default, jobNameMustBeConstantRule, jobOptionsMustSetAttemptsRule, noBlockingConcurrencyZeroRule, queueOptionsMustSetRemoveOnCompleteRule, queueOptionsMustSetRemoveOnFailRule, rules, workerMustImplementCloseRule, workerMustListenFailedRule };
