export abstract class Dialog {

  alertMessage: String;
  alertSuccess: Boolean;
  title: String;
  btnText: String;
  alertSuccesText: String;
  alertErrorText: String;
  modalMode: String;

  showAlert(message, isSuccess) {
    this.alertMessage = message;
    this.alertSuccess = isSuccess;
  }

  hiddeAlert() {
    this.alertMessage = null;
  }

  abstract closeModal(): void;
  abstract loadModalTexts(): void;

  static nonZero(control): { [key: string]: any; } {
    if (Number(control.value) < 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }
}