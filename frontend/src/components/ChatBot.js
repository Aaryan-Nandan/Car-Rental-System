import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 Welcome to CarRental. I'm your CarRental Assistant. How can I help you today?",
    },
  ]);

  // ==========================================
  // BOT RESPONSE
  // ==========================================

  const getBotResponse = (userMessage) => {
    const text = userMessage.toLowerCase().trim();

    // GREETING
    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey") ||
      text.includes("good morning") ||
      text.includes("good evening")
    ) {
      return "Hello! 👋 Welcome to our CarRental. How can I help you today?";
    }

    // AVAILABLE CARS
    if (
      text.includes("available car") ||
      text.includes("available cars") ||
      text.includes("cars available") ||
      text.includes("which cars") ||
      text.includes("what cars") ||
      text.includes("show cars")
    ) {
      return "🚗 You can view all available cars on the Home page. Select any car to see its model, company, fuel type, image, and price per day.";
    }

    // CAR TYPES
    if (
      text.includes("car model") ||
      text.includes("car models") ||
      text.includes("car type") ||
      text.includes("car types")
    ) {
      return "🚘 We have different car models available for rental. Visit the Home page to see the currently available vehicles.";
    }

    // PRICE
    if (
      text.includes("price") ||
      text.includes("cost") ||
      text.includes("how much") ||
      text.includes("per day") ||
      text.includes("rent price")
    ) {
      return "💰 Each car has a different price per day. You can check the daily rental price on the car details page.";
    }

    // CHEAP CARS
    if (
      text.includes("cheap") ||
      text.includes("cheapest") ||
      text.includes("budget") ||
      text.includes("low price")
    ) {
      return "💰 Looking for a budget-friendly car? Compare the prices of available cars on the Home page and choose the one that suits you best.";
    }

    // BOOKING
    if (
      text.includes("how to book") ||
      text.includes("book a car") ||
      text.includes("book car") ||
      text.includes("make a booking") ||
      text.includes("booking process")
    ) {
      return "📅 Booking is simple: Select a car → choose your From and To dates → provide your driving license → review your booking → complete payment → your booking will be confirmed.";
    }

    // BOOKING STATUS
    if (
      text.includes("booking status") ||
      text.includes("my booking") ||
      text.includes("booking approved") ||
      text.includes("status")
    ) {
      return "🧾 You can check your booking status from your booking/dashboard section. If your booking is waiting for approval, please wait for the admin to process it.";
    }

    // DATES
    if (
      text.includes("from date") ||
      text.includes("to date") ||
      text.includes("rental date") ||
      text.includes("rental period") ||
      text.includes("how many days")
    ) {
      return "📅 Select the date you want to pick up the car and the date you want to return it. Your rental amount is calculated based on the number of rental days.";
    }

    // DRIVING LICENSE
    if (
      text.includes("license") ||
      text.includes("licence") ||
      text.includes("driving license") ||
      text.includes("driving licence") ||
      text.includes("dl")
    ) {
      return "🪪 Yes, a valid driving license is required to rent a car. You need to provide the required license information during the booking process.";
    }

    // PAYMENT
    if (
      text.includes("payment") ||
      text.includes("pay") ||
      text.includes("payment method") ||
      text.includes("how to pay")
    ) {
      return "💳 Payment is required to confirm your booking. Please review your booking details and complete the payment process.";
    }

    // TOTAL AMOUNT
    if (
      text.includes("total amount") ||
      text.includes("total price") ||
      text.includes("calculate price") ||
      text.includes("calculate amount")
    ) {
      return "🧮 Your total rental amount depends on the car's price per day and the number of rental days.";
    }

    // CANCEL
    if (
      text.includes("cancel") ||
      text.includes("cancellation") ||
      text.includes("cancel booking")
    ) {
      return "❌ To cancel a booking, please check your booking section or contact the administrator for assistance.";
    }

    // PICKUP
    if (
      text.includes("pickup") ||
      text.includes("pick up") ||
      text.includes("collect car") ||
      text.includes("where to get car")
    ) {
      return "📍 Your pickup details will be provided with your booking information. Please check your booking details or contact the administrator.";
    }

    // RETURN
    if (
      text.includes("return car") ||
      text.includes("return the car") ||
      text.includes("drop off") ||
      text.includes("drop car")
    ) {
      return "📍 Please return the car according to the return date and location mentioned in your booking details.";
    }

    // FUEL
    if (
      text.includes("fuel") ||
      text.includes("petrol") ||
      text.includes("diesel") ||
      text.includes("fuel type")
    ) {
      return "⛽ The fuel type of each car is displayed on its details page. It may be Petrol, Diesel, or another supported fuel type.";
    }

    // CAR DETAILS
    if (
      text.includes("car details") ||
      text.includes("vehicle details") ||
      text.includes("car information")
    ) {
      return "🚘 You can see the car model, company, fuel type, image, price per day, and other available information on the car details page.";
    }

    // ADMIN
    if (
      text.includes("admin") ||
      text.includes("administrator") ||
      text.includes("contact admin")
    ) {
      return "👨‍💼 For booking approval, cancellation, pickup, return, or other problems, please contact the administrator.";
    }

    // HELP
    if (
      text.includes("help") ||
      text.includes("what can you do") ||
      text.includes("options")
    ) {
      return "🤖 I can help you with:\n\n🚗 Available Cars\n💰 Car Prices\n📅 Booking\n🪪 Driving License\n💳 Payment\n❌ Cancellation\n📍 Pickup & Return\n🧾 Booking Status\n⛽ Fuel Type";
    }

    // THANKS
    if (text.includes("thank") || text.includes("thanks")) {
      return "You're very welcome! 😊 Have a safe and enjoyable journey! 🚗";
    }

    // BYE
    if (text.includes("bye") || text.includes("goodbye")) {
      return "Goodbye! 👋 Thank you for using our CarRental. Drive safely! 🚗💨";
    }

    // DEFAULT
    return "🤔 I'm not sure about that. You can ask me about available cars, prices, booking, driving license, payment, cancellation, pickup, return, or booking status.";
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = (customMessage = null) => {
    const textToSend =
      customMessage !== null ? customMessage : message;

    if (!textToSend.trim()) {
      return;
    }

    const userMessage = {
      sender: "user",
      text: textToSend,
    };

    const botMessage = {
      sender: "bot",
      text: getBotResponse(textToSend),
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
      botMessage,
    ]);

    setMessage("");
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ==========================================
  // QUICK QUESTIONS
  // ==========================================

  const quickQuestions = [
    "What cars are available?",
    "What is the price?",
    "How can I book a car?",
    "Do I need a driving license?",
    "How does payment work?",
    "How can I cancel my booking?",
  ];

  // ==========================================
  // END CHAT
  // ==========================================

  const endChat = () => {
    setIsOpen(false);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {/* ======================================
          FLOATING CHATBOT BUTTON
      ====================================== */}

      {!isOpen && (
        <button
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open CarRental Assistant"
          title="Open CarRental Assistant"
        >
          <img
            src="/car-rental-logo.png"
            alt="CarRental"
            className="floating-logo"
          />

          <span className="chat-badge">
            💬
          </span>
        </button>
      )}

      {/* ======================================
          CHAT WINDOW
      ====================================== */}

      {isOpen && (
        <div className="chatbot-container">

          {/* ====================================
              HEADER
          ==================================== */}

          <div className="chatbot-header">

            <div className="chatbot-brand">

              {/* LOGO */}

              <div className="logo-container">
                <img
                  src="/car-rental-logo.png"
                  alt="CarRental Logo"
                  className="chatbot-logo"
                />
              </div>

              {/* TITLE */}

              <div className="chatbot-title">

                <strong>
                  CarRental Assistant
                </strong>

                <div className="online-status">
                  <span className="online-dot">
                    ●
                  </span>

                  Online
                </div>

              </div>

            </div>

            {/* =================================
                CLOSE / END CHAT BUTTON
            ================================== */}

            <button
              className="close-button"
              onClick={endChat}
              aria-label="End chat"
              title="End chat"
            >
              ✕
            </button>

          </div>

          {/* ====================================
              WELCOME AREA
          ==================================== */}

          <div className="chatbot-welcome">

            <img
              src="/car-rental-logo.png"
              alt="CarRental"
              className="welcome-logo"
            />

            <div>
              <h3>
                How can I help you?
              </h3>

              <p>
                Ask me anything about carRental.
              </p>
            </div>

          </div>

          {/* ====================================
              MESSAGES
          ==================================== */}

          <div className="chatbot-messages">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "message-wrapper user-wrapper"
                    : "message-wrapper bot-wrapper"
                }
              >

                {/* BOT LOGO */}

                {msg.sender === "bot" && (
                  <img
                    src="/car-rental-logo.png"
                    alt="Bot"
                    className="small-bot-logo"
                  />
                )}

                {/* MESSAGE */}

                <div
                  className={
                    msg.sender === "user"
                      ? "message user-message"
                      : "message bot-message"
                  }
                >

                  {msg.text
                    .split("\n")
                    .map((line, i) => (

                      <React.Fragment key={i}>

                        {line}

                        {i <
                          msg.text.split("\n").length - 1 && (
                          <br />
                        )}

                      </React.Fragment>

                    ))}

                </div>

              </div>

            ))}

          </div>

          {/* ====================================
              QUICK QUESTIONS
          ==================================== */}

          <div className="quick-questions">

            <div className="quick-title">
              Popular Questions
            </div>

            <div className="quick-buttons">

              {quickQuestions.map(
                (question, index) => (

                  <button
                    key={index}
                    onClick={() =>
                      sendMessage(question)
                    }
                  >
                    {question}
                  </button>

                )
              )}

            </div>

          </div>

          {/* ====================================
              INPUT
          ==================================== */}

          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Ask about carRental..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              className="send-button"
              onClick={() => sendMessage()}
              aria-label="Send message"
              title="Send message"
            >
              ➤
            </button>

          </div>

        </div>
      )}

    </>
  );
};

export default ChatBot;