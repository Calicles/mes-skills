const noop = new Proxy(function () {}, { get: (t, p) => (p === "then" ? undefined : noop), apply: () => noop, construct: () => noop });
export const ActionFormData = noop, ModalFormData = noop, MessageFormData = noop;
