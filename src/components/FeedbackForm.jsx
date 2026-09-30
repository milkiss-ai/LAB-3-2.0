import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const [wantReply, setWantReply] = useState(false);

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    message: null,
    phone: null,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
    phone: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);


  const validateName = (value) => {
    if (!value.trim()) {
      return "Имя обязательно для заполнения";
    }

    if (value.trim().length < 2) {
      return "Минимум 2 символа";
    }

    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim())) {
      return "Только буквы, пробелы и дефис";
    }

    return null;
  };

  const validateEmail = (value) => {

    if (!wantReply && !value.trim()) {
      return null;
    }

    if (wantReply && !value.trim()) {
      return "Email обязателен для получения ответа";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Некорректный формат email";
    }

    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) {
      return "Сообщение обязательно для заполнения";
    }

    if (value.trim().length < 6) {
      return "Минимум 6 символов";
    }

    if (value.length > 500) {
      return "Максимум 500 символов";
    }

    return null;
  };

  const validatePhone = (value) => {
    if (!value.trim()) {
      return "Телефон обязателен для заполнения";
    }

    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) {
      return "Формат: +7 (XXX) XXX-XX-XX";
    }

    return null;
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "name":
        setName(value);
        break;

      case "email":
        setEmail(value);
        break;

      case "message":
        setMessage(value);
        break;

      case "phone":
        setPhone(value);
        break;

      default:
        break;
    }

    if (touched[field]) {
      let error = null;

      if (field === "name") {
        error = validateName(value);
      }

      if (field === "email") {
        error = validateEmail(value);
      }

      if (field === "message") {
        error = validateMessage(value);
      }

      if (field === "phone") {
        error = validatePhone(value);
      }

      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handlePhoneChange = (value) => {
    // Оставляем только цифры
    let digits = value.replace(/\D/g, "");

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    digits = digits.slice(0, 11);

    let formatted = "";

    if (digits.length > 0) {
      formatted = "+7";
    }

    if (digits.length > 1) {
      formatted += " (" + digits.slice(1, 4);
    }

    if (digits.length >= 4) {
      formatted += ")";
    }

    if (digits.length >= 5) {
      formatted += " " + digits.slice(4, 7);
    }

    if (digits.length >= 8) {
      formatted += "-" + digits.slice(7, 9);
    }

    if (digits.length >= 10) {
      formatted += "-" + digits.slice(9, 11);
    }

    setPhone(formatted);

    if (touched.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(formatted),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    let currentValue = "";

    if (field === "name") {
      currentValue = name;
    }

    if (field === "email") {
      currentValue = email;
    }

    if (field === "message") {
      currentValue = message;
    }

    if (field === "phone") {
      currentValue = phone;
    }

    let error = null;

    if (field === "name") {
      error = validateName(currentValue);
    }

    if (field === "email") {
      error = validateEmail(currentValue);
    }

    if (field === "message") {
      error = validateMessage(currentValue);
    }

    if (field === "phone") {
      error = validatePhone(currentValue);
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleReplyChange = (e) => {
    const checked = e.target.checked;

    setWantReply(checked);

    setErrors((prev) => ({
      ...prev,
      email: validateEmail(email),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
      phone: validatePhone(phone),
    };

    setErrors(newErrors);

    setTouched({
      name: true,
      email: true,
      message: true,
      phone: true,
    });

    if (Object.values(newErrors).some((error) => error !== null)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field__input"];

    if (touched[field] && errors[field]) {
      classes.push("field__input--error");
    } else if (touched[field] && !errors[field]) {
      classes.push("field__input--valid");
    }

    if (field === "message") {
      classes.push("field__input--textarea");
    }

    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2 className="feedback-form__title">
          Спасибо за обращение!
        </h2>

        <p className="feedback-form__text">
          Мы свяжемся с вами в ближайшее время.
        </p>

        <button
          type="button"
          className="feedback-form__submit"
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            setPhone("");
            setWantReply(false);

            setErrors({
              name: null,
              email: null,
              message: null,
              phone: null,
            });

            setTouched({
              name: false,
              email: false,
              message: false,
              phone: false,
            });

            setSubmitted(false);
          }}
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name" className="field__label">
          Имя
        </label>

        <input
          id="name"
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) =>
            handleChange("name", e.target.value)
          }
          onBlur={() => handleBlur("name")}
        />

        {touched.name && errors.name && (
          <span className="field__error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="phone" className="field__label">
          Телефон
        </label>

        <input
          id="phone"
          type="tel"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) =>
            handlePhoneChange(e.target.value)
          }
          onBlur={() => handleBlur("phone")}
          placeholder="+7 (XXX) XXX-XX-XX"
        />

        {touched.phone && errors.phone && (
          <span className="field__error">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="checkbox-field">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={wantReply}
            onChange={handleReplyChange}
          />

          <span>Хочу получить ответ</span>
        </label>
      </div>

      <div className="field">
        <label htmlFor="email" className="field__label">
          Email
        </label>

        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) =>
            handleChange("email", e.target.value)
          }
          onBlur={() => handleBlur("email")}
          placeholder={
            wantReply
              ? "Введите email"
              : "Необязательно"
          }
        />

        {touched.email && errors.email && (
          <span className="field__error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="message" className="field__label">
          Сообщение
        </label>

        <textarea
          id="message"
          className={getInputClass("message")}
          value={message}
          onChange={(e) =>
            handleChange("message", e.target.value)
          }
          onBlur={() => handleBlur("message")}
          rows={5}
          maxLength={500}
        />

        <div className="character-counter">
          {message.length} / 500
        </div>

        {touched.message && errors.message && (
          <span className="field__error">
            {errors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="feedback-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;