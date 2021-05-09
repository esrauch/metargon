
// A control is an exclusive mode that turns user input into whatever actions.

interface Control {
    enable(): void;
    disable(): void;
}