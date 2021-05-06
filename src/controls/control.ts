
// A control is basically a user mode that can be activated or deactivated.

interface Control {
    enable(): void;
    disable(): void;
}