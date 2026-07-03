(function () {
  if (typeof Swal === 'undefined') {
    console.warn('SweetAlert2 no está disponible.');
    return;
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function applyLegacyButtons(options) {
    if (isPlainObject(options.button)) {
      options.showConfirmButton = true;
      if (options.button.text) {
        options.confirmButtonText = options.button.text;
      }
    }

    if (isPlainObject(options.buttons)) {
      if (options.buttons.confirm) {
        options.showConfirmButton = true;
        if (typeof options.buttons.confirm === 'string') {
          options.confirmButtonText = options.buttons.confirm;
        }
      }
      if (options.buttons.cancel) {
        options.showCancelButton = true;
        if (typeof options.buttons.cancel === 'string') {
          options.cancelButtonText = options.buttons.cancel;
        }
      }
    }

    if (options.buttons === false) {
      options.showConfirmButton = false;
      options.showCancelButton = false;
    }

    if (options.content === 'input' && !options.input) {
      options.input = 'text';
    }

    if (options.input) {
      options.showConfirmButton = options.showConfirmButton !== false;
      options.showCancelButton = options.showCancelButton !== false;
    }

    if (options.showConfirmButton && typeof options.confirmButtonText === 'undefined') {
      options.confirmButtonText = 'Aceptar';
    }

    if (options.showCancelButton && typeof options.cancelButtonText === 'undefined') {
      options.cancelButtonText = 'Cancelar';
    }

  }

  function finalizeOptions(options) {
    applyLegacyButtons(options);

    if (options.icon && !options.iconColor) {
      options.iconColor = '#2563eb';
    }

    if (options.timer) {
      options.timerProgressBar = true;
    }

    if (options.showConfirmButton && options.showCancelButton) {
      options.reverseButtons = false;
    }

    return options;
  }

  function normalizeOptions(args) {
    if (!args.length) {
      return finalizeOptions({ icon: 'info' });
    }

    const first = args[0];
    const second = args[1];

    if (typeof first === 'string') {
      const options = isPlainObject(second) ? { ...second } : {};
      options.title = options.title || 'Confirme';
      options.text = options.text || first;
      return finalizeOptions(options);
    }

    if (isPlainObject(first)) {
      return finalizeOptions({ ...first });
    }

    return finalizeOptions({ title: String(first) });
  }

  window.swal = function (...args) {
    const options = normalizeOptions(args);
    const promise = Swal.fire(options);

    return promise.then((result) => {
      if (options.input) {
        if (result.isDismissed) {
          throw new Error('dismissed');
        }
        return result.value;
      }

      if (result.isConfirmed) {
        return true;
      }

      return false;
    });
  };
})();
