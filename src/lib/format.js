export function cx() {
  return Array.prototype.slice
    .call(arguments)
    .filter(Boolean)
    .join(" ");
}

export function safeParseJson(value, fallbackValue) {
  if (!value) {
    return fallbackValue;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallbackValue;
  }
}

export function getGraphQLErrorMessages(error) {
  if (!error) {
    return [];
  }

  if (error.graphQLErrors && error.graphQLErrors.length) {
    return error.graphQLErrors.reduce(function collect(messages, graphQLError) {
      var nestedErrors =
        graphQLError &&
        graphQLError.data &&
        graphQLError.data.errors &&
        graphQLError.data.errors.length
          ? graphQLError.data.errors
          : [];

      if (nestedErrors.length) {
        return messages.concat(nestedErrors);
      }

      if (graphQLError && graphQLError.message) {
        messages.push(graphQLError.message);
      }

      return messages;
    }, []);
  }

  return [error.message || "Something went wrong."];
}

export function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  var date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) {
    return "Unknown";
  }

  var date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeDate(value) {
  if (!value) {
    return "No activity";
  }

  var date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "No activity";
  }

  var difference = Date.now() - date.getTime();
  var minute = 60 * 1000;
  var hour = 60 * minute;
  var day = 24 * hour;

  if (difference < hour) {
    return Math.max(1, Math.round(difference / minute)) + "m ago";
  }

  if (difference < day) {
    return Math.round(difference / hour) + "h ago";
  }

  if (difference < 7 * day) {
    return Math.round(difference / day) + "d ago";
  }

  return formatDate(value);
}

export function pluralize(count, singular, plural) {
  if (count === 1) {
    return singular;
  }

  return plural || singular + "s";
}

export function sum(values) {
  return (values || []).reduce(function add(total, value) {
    return total + (Number(value) || 0);
  }, 0);
}

export function truncate(value, limit) {
  if (!value) {
    return "";
  }

  if (value.length <= limit) {
    return value;
  }

  return value.slice(0, limit - 3) + "...";
}

export function getInitials(firstName, lastName) {
  var first = firstName ? firstName.charAt(0) : "";
  var last = lastName ? lastName.charAt(0) : "";
  var initials = (first + last).trim();

  return initials || "IF";
}

export function toSentenceCase(value) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/(^|\s)\S/g, function capitalize(character) {
      return character.toUpperCase();
    });
}
