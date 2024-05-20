class Timer {
  constructor() {
    this.timerInterval = null;
    this.minutes = 0;
    this.seconds = 0;
    this.isRunning = false;
    this.initDOM();
    this.attachEventListeners();
    this.requestNotificationPermission();
  }

  requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }

  initDOM() {
    this.minutesElement = document.getElementById("minutes");
    this.secondsElement = document.getElementById("seconds");
    this.startButton = document.getElementById("start");
    this.stopButton = document.getElementById("stop");
    this.customTimeInput = document.getElementById("custom-time");
    this.timeButtonsContainer = document.querySelector(".time-buttons");
    this.updateUI();
  }

  attachEventListeners() {
    this.startButton.addEventListener("click", () => this.start());
    this.stopButton.addEventListener("click", () => this.stop());
    this.customTimeInput.addEventListener("input", () => this.updateStartButtonState());
    this.timeButtonsContainer.addEventListener("click", event => {
      if (event.target.tagName === "BUTTON") {
        this.start(parseInt(event.target.dataset.time));
      }
    });
  }

  start(time = parseInt(this.customTimeInput.value)) {
    if (this.isRunning) return;
    if (isNaN(time) || time < 0) time = 0;
    this.minutes = Math.floor(time);
    this.seconds = 0;
    this.isRunning = true;
    this.updateUI();
    this.timerInterval = setInterval(() => this.tick(), 1000);
  }

  stop() {
    clearInterval(this.timerInterval);
    this.isRunning = false;
    this.minutes = 0;
    this.seconds = 0;
    this.updateUI();
  }

  tick() {
    if (this.seconds === 0 && this.minutes === 0) {
      this.stop();
      this.notifyCompletion();
      return;
    }
    this.seconds = this.seconds === 0 ? 59 : this.seconds - 1;
    this.minutes = this.seconds === 59 ? this.minutes - 1 : this.minutes;
    this.updateUI();
  }

  updateUI() {
    this.minutesElement.textContent = this.minutes.toString().padStart(2, "0");
    this.secondsElement.textContent = this.seconds.toString().padStart(2, "0");
    document.title = `${this.minutes.toString().padStart(2, "0")}:${this.seconds.toString().padStart(2, "0")}`;
    this.startButton.disabled = this.isRunning || this.customTimeInput.value === "";
    this.stopButton.disabled = !this.isRunning;
    this.stopButton.classList.toggle("disabled", !this.isRunning);
    this.customTimeInput.disabled = this.isRunning;
    this.timeButtonsContainer.querySelectorAll("button").forEach(button => {
      button.disabled = this.isRunning;
      button.classList.toggle("disabled", this.isRunning);
    });
  }

  updateStartButtonState() {
    this.startButton.disabled = this.customTimeInput.value === "";
  }

  notifyCompletion() {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Ding! It's ready!", { body: "The timer is over." });
    }
    document.title = "Finished";
  }
}

new Timer();
