export const silenceConsole = () => {
    if (process.env.NODE_ENV === 'development') {
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
    console.error = () => {}; // Optional – hide errors too, not usually recommended
  }
}