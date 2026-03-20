// Simple event-bus based toast API
// Usage: toast.success('Done!') | toast.error('Oops!') | toast.info('Note')

const listeners = new Set();

const emit = (type, message) => {
  listeners.forEach(fn => fn({ type, message, id: Date.now() + Math.random() }));
};

const toast = {
  success: (message) => emit('success', message),
  error:   (message) => emit('error',   message),
  info:    (message) => emit('info',    message),
  _subscribe:   (fn) => { listeners.add(fn);    return () => listeners.delete(fn); },
};

export default toast;
