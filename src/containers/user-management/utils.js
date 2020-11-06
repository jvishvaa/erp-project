function buildFormData(formData, data, parentKey) {
  if (
    data &&
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File) &&
    !(parentKey == 'parent')
  ) {
    Object.keys(data).forEach((key) => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    const value = data == null ? '' : data;

    if (parentKey == 'parent') {
      formData.append(parentKey, JSON.stringify(value));
    } else {
      formData.append(parentKey, value);
    }
  }
}

export function jsonToFormData(data) {
  const formData = new FormData();

  buildFormData(formData, data);

  return formData;
}

export function getSteps(showParentOrGuardian) {
  if (!showParentOrGuardian) {
    return ['School details', 'User details'];
  }
  return ['School details', 'User details', 'Parents/Guardian details'];
}
