// A list of text fields that grows with a button. Another field can be added
// only when every field in the list is filled in. Used by the policy and RFP
// generators for their websites (and the policy's monitoring tools).
export function fieldList(list, button, name, label, type = 'text') {
  function update() {
    button.disabled = Array.from(list.children).some(function (input) { return !input.value.trim(); });
  }
  function add(value) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.className = 'form-control form-control-lg';
    input.value = value || '';
    input.setAttribute('aria-label', label + ' ' + (list.children.length + 1));
    list.appendChild(input);
    update();
    return input;
  }
  list.addEventListener('input', update);
  button.addEventListener('click', function () { add().focus(); });
  return {
    add: add,
    update: update,
    trim: function (keep) {
      while (list.children.length > keep) list.lastChild.remove();
      update();
    }
  };
}
