/* @ds-bundle: {"format":4,"namespace":"MorrowDesignSystem_ba8ef2","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Card","sourcePath":"components/data/Card.jsx"},{"name":"CollectionCard","sourcePath":"components/data/CollectionCard.jsx"},{"name":"JournalCard","sourcePath":"components/data/JournalCard.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Button.jsx":"d9f46b44e96c","components/data/Avatar.jsx":"19b3d92423a6","components/data/Card.jsx":"4ccb9b1f7d84","components/data/CollectionCard.jsx":"2112b9413393","components/data/JournalCard.jsx":"f810a326e80b","components/feedback/Badge.jsx":"0a35e19bfcdb","components/feedback/Dialog.jsx":"4eb2f84ad99e","components/feedback/Tag.jsx":"f353e0aa9d13","components/feedback/Toast.jsx":"ca166059c2e3","components/feedback/Tooltip.jsx":"ee7de537e1b4","components/forms/Checkbox.jsx":"22113aa827bf","components/forms/Input.jsx":"3f3fa62ea4f4","components/forms/Select.jsx":"d4a337b5eee1","components/forms/Switch.jsx":"5883ea6f1a12","components/forms/Textarea.jsx":"60715244afa3","components/navigation/Tabs.jsx":"9d1022df646f","ui_kits/dashboard/DashboardScreen.jsx":"be02b313f9ea","ui_kits/dashboard/InspirationScreen.jsx":"d2973f0b5180","ui_kits/dashboard/NotesScreen.jsx":"49167f649103","ui_kits/dashboard/ProjectsScreen.jsx":"c6645a2ae51e","ui_kits/dashboard/ResourcesScreen.jsx":"2ef7115c588b","ui_kits/dashboard/Sidebar.jsx":"e67c746aab5f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MorrowDesignSystem_ba8ef2 = window.MorrowDesignSystem_ba8ef2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    padding: '8px 16px',
    fontSize: 'var(--text-sm)',
    height: 36
  },
  md: {
    padding: '11px 22px',
    fontSize: 'var(--text-md)',
    height: 44
  },
  lg: {
    padding: '15px 28px',
    fontSize: 'var(--text-lg)',
    height: 52
  }
};
const variantStyle = (variant, disabled) => {
  if (disabled) {
    return {
      background: 'var(--cream-100)',
      color: 'var(--text-tertiary)',
      border: '1px solid var(--border-subtle)'
    };
  }
  switch (variant) {
    case 'secondary':
      return {
        background: 'var(--surface-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-default)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid transparent'
      };
    case 'accent':
      return {
        background: 'var(--accent-coral)',
        color: 'var(--text-on-accent)',
        border: '1px solid transparent'
      };
    default:
      return {
        background: 'var(--brand-primary)',
        color: 'var(--text-on-accent)',
        border: '1px solid transparent'
      };
  }
};

/** Primary interactive control. Soft pill shape, no bounce — gentle opacity/lift on hover. */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    borderRadius: 'var(--radius-pill)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'transform var(--dur-fast) var(--ease-out), opacity var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    letterSpacing: '0.01em',
    boxShadow: variant === 'primary' && !disabled ? 'var(--shadow-sm)' : 'none',
    opacity: hover && !disabled ? 0.88 : 1,
    transform: hover && !disabled ? 'translateY(-1px)' : 'none',
    ...sizes[size],
    ...variantStyle(variant, disabled),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: base
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
/** Circular avatar — photo or initials fallback on a sage tint. */
function Avatar({
  src,
  name = '',
  size = 40
}) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--sage-200)',
      color: 'var(--sage-900)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: size * 0.38,
      flexShrink: 0
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Card.jsx
try { (() => {
/** Generic surface card — rounded, soft-shadowed, optional cover image slot. */
function Card({
  children,
  cover,
  style,
  onClick,
  padding = 20
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform var(--dur-med) var(--ease-out), box-shadow var(--dur-med) var(--ease-out)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, cover && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '16/10',
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/CollectionCard.jsx
try { (() => {
/** Collection tile: one large cover image, three thumbnails, label + item count — for grouping inspiration/photo sets. */
function CollectionCard({
  cover,
  thumbnails = [],
  label,
  count,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      padding: 16,
      fontFamily: 'var(--font-body)',
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'transform var(--dur-med) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      aspectRatio: '4/3',
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, thumbnails.slice(0, 3).map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      aspectRatio: '1/1',
      borderRadius: 'var(--radius-md)',
      backgroundImage: `url(${t})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '2px 4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-tertiary)'
    }
  }, count)));
}
Object.assign(__ds_scope, { CollectionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/CollectionCard.jsx", error: String((e && e.message) || e) }); }

// components/data/JournalCard.jsx
try { (() => {
/** Journal/moment card: eyebrow tag + date pill, editorial title + caption, full-bleed photo with a location overlay. */
function JournalCard({
  tag,
  dateLabel,
  dateValue,
  title,
  caption,
  image,
  location,
  sublocation
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      padding: 20,
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--ink-900)',
      color: '#fff',
      fontSize: 'var(--text-xs)',
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)'
    }
  }, tag), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden',
      fontSize: 'var(--text-xs)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '6px 12px',
      color: 'var(--text-primary)'
    }
  }, dateLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '6px 12px',
      background: '#fff',
      fontWeight: 600
    }
  }, dateValue))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 'var(--display-sm)',
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--text-tertiary)',
      marginTop: 8,
      lineHeight: 'var(--lh-body)'
    }
  }, caption)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      aspectRatio: '4/3',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 16,
      color: '#fff',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "white",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s-7-7.2-7-12a7 7 0 1 1 14 0c0 4.8-7 12-7 12z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "9",
    r: "2.4"
  })), location), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: 0.85
    }
  }, sublocation))));
}
Object.assign(__ds_scope, { JournalCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/JournalCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    bg: 'var(--cream-100)',
    fg: 'var(--text-secondary)'
  },
  sage: {
    bg: 'var(--sage-200)',
    fg: 'var(--sage-900)'
  },
  blush: {
    bg: 'var(--blush-200)',
    fg: 'var(--blush-600)'
  },
  coral: {
    bg: 'var(--accent-coral)',
    fg: '#fff'
  }
};
/** Small status pill — used for project status, category labels. */
function Badge({
  children,
  tone = 'neutral'
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      background: t.bg,
      color: t.fg,
      letterSpacing: '0.01em'
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** Centered modal on a frosted-glass scrim — for confirmations and quick-create forms. */
function Dialog({
  open,
  onClose,
  title,
  children,
  footer
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'color-mix(in oklch, var(--ink-900) 35%, transparent)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      padding: 28,
      width: 420,
      maxWidth: '90vw',
      boxShadow: 'var(--shadow-lg)',
      fontFamily: 'var(--font-body)'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--display-sm)',
      color: 'var(--text-primary)',
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-md)',
      lineHeight: 'var(--lh-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 22
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
/** Removable filter/tag chip, used for inspiration & resource tagging. */
function Tag({
  children,
  onRemove,
  active = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      cursor: onClick ? 'pointer' : 'default',
      background: active ? 'var(--brand-primary)' : 'var(--surface-card)',
      color: active ? '#fff' : 'var(--text-secondary)',
      border: active ? 'none' : '1px solid var(--border-default)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      opacity: 0.7,
      fontSize: '0.9em'
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
/** Corner toast — soft card, slow fade+rise entrance, auto-dismiss handled by caller. */
function Toast({
  title,
  description,
  tone = 'neutral',
  onClose
}) {
  const dot = {
    neutral: 'var(--brand-primary)',
    success: 'var(--state-success)',
    danger: 'var(--state-danger)'
  }[tone] || 'var(--brand-primary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px',
      boxShadow: 'var(--shadow-lg)',
      minWidth: 280,
      maxWidth: 360,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: dot,
      marginTop: 6,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-secondary)',
      marginTop: 4,
      lineHeight: 'var(--lh-body)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      cursor: 'pointer',
      color: 'var(--text-tertiary)',
      fontSize: 'var(--text-sm)'
    }
  }, "\u2715"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Soft floating tooltip — fades in, never bounces. */
function Tooltip({
  children,
  label,
  side = 'top'
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: '110%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }[side] || {};
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...pos,
      whiteSpace: 'nowrap',
      background: 'var(--ink-900)',
      color: 'var(--text-on-dark)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-2xs)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      opacity: show ? 1 : 0,
      transition: 'opacity var(--dur-med) var(--ease-out)',
      pointerEvents: 'none',
      boxShadow: 'var(--shadow-sm)'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/** Rounded-square checkbox; checked state fills sage with a soft check mark, no hard borders. */
function Checkbox({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 20,
      height: 20,
      borderRadius: 7,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--brand-primary)' : 'var(--cream-100)',
      border: checked ? 'none' : '1px solid var(--border-default)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "10",
    viewBox: "0 0 12 10",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 5L4.5 8.5L11 1.5",
    stroke: "white",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
/** Single-line text field with soft cream fill, no heavy borders — focus adds a gentle sage ring. */
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  helperText,
  error,
  icon = null,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--cream-100)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      border: `1px solid ${error ? 'var(--state-danger)' : focused ? 'var(--brand-primary)' : 'transparent'}`,
      boxShadow: focused ? `0 0 0 3px ${'var(--focus-ring)'}` : 'none',
      transition: 'box-shadow var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, icon, /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      width: '100%',
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit'
    }
  })), helperText && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--state-danger)' : 'var(--text-tertiary)'
    }
  }, helperText));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Minimal dropdown select, matches Input's soft-fill shape. */
function Select({
  label,
  value,
  onChange,
  options = [],
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: onChange,
    style: {
      border: 'none',
      outline: 'none',
      background: 'var(--cream-100)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)',
      fontFamily: 'inherit',
      appearance: 'none'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Pill toggle switch; slow, breathing slide rather than a snap. */
function Switch({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 42,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--brand-primary)' : 'var(--warm-300)',
      position: 'relative',
      transition: 'background var(--dur-med) var(--ease-breath)',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 21 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-med) var(--ease-breath)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
/** Multi-line note field; same soft-fill treatment as Input, taller and resizable. */
function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("textarea", {
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    rows: rows,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      border: `1px solid ${focused ? 'var(--brand-primary)' : 'transparent'}`,
      outline: 'none',
      resize: 'vertical',
      fontFamily: 'inherit',
      background: 'var(--cream-100)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: 'var(--text-md)',
      color: 'var(--text-primary)',
      boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'none',
      lineHeight: 'var(--lh-body)'
    }
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Underline-less segmented tabs; active tab gets a soft pill background. */
function Tabs({
  items,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 4,
      background: 'var(--cream-100)',
      padding: 4,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)'
    }
  }, items.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.value,
    onClick: () => onChange && onChange(item.value),
    style: {
      padding: '8px 18px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-sm)',
      cursor: 'pointer',
      fontWeight: 500,
      color: active === item.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
      background: active === item.value ? 'var(--surface-card)' : 'transparent',
      boxShadow: active === item.value ? 'var(--shadow-sm)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, item.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashboardScreen.jsx
try { (() => {
const {
  Card,
  Badge
} = window.MorrowDesignSystem_ba8ef2;
function DashboardScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 44px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      flex: 1,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-tertiary)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase'
    }
  }, "Tuesday, July 14"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 40,
      color: 'var(--text-primary)',
      marginTop: 4
    }
  }, "Good morning, Skylar")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 14
    }
  }, "Today's focus"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, [{
    n: 'Morning Light App',
    t: 'Onboarding flow',
    tone: 'sage'
  }, {
    n: 'Aster Studio site',
    t: 'Hero exploration',
    tone: 'blush'
  }, {
    n: 'Client review',
    t: 'Waterlily deck',
    tone: 'coral'
  }].map(c => /*#__PURE__*/React.createElement("div", {
    key: c.n,
    style: {
      flex: 1,
      background: 'var(--surface-card)',
      borderRadius: 20,
      padding: 20,
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: c.tone
  }, c.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      marginTop: 12,
      color: 'var(--text-primary)'
    }
  }, c.n))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 14
    }
  }, "Recently viewed"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, ['Waterlily UI — sketchbook', 'Grain gradient study', 'Antelope Canyon reference'].map(r => /*#__PURE__*/React.createElement("div", {
    key: r,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 14,
      padding: '14px 18px',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, r), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, "2h ago"))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 14
    }
  }, "Recent notes"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 16,
      padding: 18,
      boxShadow: 'var(--shadow-sm)',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, "\"Client wants a softer transition between the hero and the pricing section \u2014 maybe a grain gradient wash instead of a hard line.\""))));
}
window.DashboardScreen = DashboardScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/InspirationScreen.jsx
try { (() => {
const {
  Tag,
  Input
} = window.MorrowDesignSystem_ba8ef2;
const items = [{
  title: 'Discovering peace',
  tag: 'Landscape',
  img: '../../assets/images/hero-meadow.png'
}, {
  title: 'Lotus study',
  tag: 'Botanical',
  img: '../../assets/images/lotus-petals-2.png'
}, {
  title: 'Petal macro',
  tag: 'Botanical',
  img: '../../assets/images/petal-macro-2.png'
}, {
  title: 'Grain wash — green',
  tag: 'Texture',
  img: '../../assets/images/grain-gradient-green.png'
}, {
  title: 'Grain wash — coral',
  tag: 'Texture',
  img: '../../assets/images/grain-gradient-coral.png'
}, {
  title: 'Tulip glass form',
  tag: 'Object',
  img: '../../assets/images/glass-tulip-sage.png'
}];
function InspirationScreen() {
  const [active, setActive] = React.useState('All');
  const tags = ['All', 'Botanical', 'Texture', 'Landscape', 'Object'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 44px',
      flex: 1,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 32,
      color: 'var(--text-primary)',
      marginBottom: 18
    }
  }, "Inspiration"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search references..."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 24
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t,
    active: active === t,
    onClick: () => setActive(t)
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.title,
    style: {
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 130,
      backgroundImage: `url(${it.img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-primary)'
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, it.tag))))));
}
window.InspirationScreen = InspirationScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/InspirationScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/NotesScreen.jsx
try { (() => {
const {
  Button,
  Textarea
} = window.MorrowDesignSystem_ba8ef2;
const notes = [{
  title: 'Client feedback — Aster Studio',
  body: "Wants a softer transition between hero and pricing — a grain gradient wash instead of a hard line.",
  time: '2h ago'
}, {
  title: 'UX observation',
  body: 'Users skip the onboarding tooltip entirely. Maybe fold it into the empty state instead.',
  time: 'Yesterday'
}, {
  title: 'Idea',
  body: 'A "quiet mode" that dims saturation across the whole dashboard after 8pm.',
  time: '3 days ago'
}];
function NotesScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 44px',
      flex: 1,
      overflow: 'auto',
      display: 'flex',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 32,
      color: 'var(--text-primary)',
      marginBottom: 18
    }
  }, "Notes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, notes.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.title,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 16,
      padding: 18,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, n.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, n.time)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 6,
      lineHeight: 1.6
    }
  }, n.body))))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, "Quick note"), /*#__PURE__*/React.createElement(Textarea, {
    rows: 6,
    placeholder: "Jot down an idea..."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Save"))));
}
window.NotesScreen = NotesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/NotesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ProjectsScreen.jsx
try { (() => {
const {
  Card,
  Badge,
  Button,
  Tabs
} = window.MorrowDesignSystem_ba8ef2;
const projects = [{
  name: 'Morning Light App',
  desc: 'Wellness onboarding + habit tracker',
  status: 'Active',
  tone: 'sage',
  cover: '../../assets/images/hero-meadow.png'
}, {
  name: 'Aster Studio',
  desc: 'Marketing site for a floral studio',
  status: 'Active',
  tone: 'sage',
  cover: '../../assets/images/lotus-petals-1.png'
}, {
  name: 'Waterlily UI kit',
  desc: 'Exploratory component sketches',
  status: 'Draft',
  tone: 'blush',
  cover: '../../assets/images/petal-macro-1.png'
}, {
  name: 'Client rebrand',
  desc: 'Identity refresh for a tea brand',
  status: 'Review',
  tone: 'coral',
  cover: '../../assets/images/grain-gradient-sage-blush.png'
}];
function ProjectsScreen() {
  const [tab, setTab] = React.useState('all');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 44px',
      flex: 1,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 32,
      color: 'var(--text-primary)'
    }
  }, "Projects"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "New project")), /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'all',
      label: 'All'
    }, {
      value: 'active',
      label: 'Active'
    }, {
      value: 'draft',
      label: 'Draft'
    }],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 20,
      marginTop: 24
    }
  }, projects.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      backgroundImage: `url(${p.cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: p.tone
  }, p.status), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      marginTop: 10,
      color: 'var(--text-primary)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 4
    }
  }, p.desc))))));
}
window.ProjectsScreen = ProjectsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ProjectsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ResourcesScreen.jsx
try { (() => {
const {
  Tag
} = window.MorrowDesignSystem_ba8ef2;
const groups = [{
  name: 'Fonts',
  items: ['Canela', 'Satoshi', 'Fraunces']
}, {
  name: 'Icons',
  items: ['Lucide', 'Phosphor']
}, {
  name: 'Plugins',
  items: ['Figma Tokens', 'Autoflow']
}, {
  name: 'AI tools',
  items: ['Midjourney', 'Claude']
}, {
  name: 'Accessibility',
  items: ['Stark', 'Contrast Checker']
}, {
  name: 'Animation',
  items: ['Lottie', 'Rive']
}];
function ResourcesScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '36px 44px',
      flex: 1,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 32,
      color: 'var(--text-primary)',
      marginBottom: 24
    }
  }, "Resources"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.name,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 18,
      padding: 20,
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-primary)',
      marginBottom: 10
    }
  }, g.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, g.items.map(it => /*#__PURE__*/React.createElement(Tag, {
    key: it
  }, it)))))));
}
window.ResourcesScreen = ResourcesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ResourcesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Sidebar.jsx
try { (() => {
const {
  Avatar,
  Badge,
  Tag
} = window.MorrowDesignSystem_ba8ef2;
function Sidebar({
  active,
  onNav
}) {
  const items = [{
    key: 'dashboard',
    label: 'Dashboard'
  }, {
    key: 'projects',
    label: 'Projects'
  }, {
    key: 'inspiration',
    label: 'Inspiration'
  }, {
    key: 'notes',
    label: 'Notes'
  }, {
    key: 'resources',
    label: 'Resources'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      flexShrink: 0,
      background: 'var(--surface-canvas)',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      borderRight: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/morrow-logo-horizontal-black.svg",
    style: {
      height: 22,
      width: 'fit-content'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Skylar Rowe",
    size: 38
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, "Skylar Rowe"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, "UI/UX Designer"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    onClick: () => onNav(it.key),
    style: {
      padding: '10px 14px',
      borderRadius: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      background: active === it.key ? 'var(--surface-card)' : 'transparent',
      color: active === it.key ? 'var(--text-primary)' : 'var(--text-secondary)',
      boxShadow: active === it.key ? 'var(--shadow-sm)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, it.label))));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CollectionCard = __ds_scope.CollectionCard;

__ds_ns.JournalCard = __ds_scope.JournalCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
