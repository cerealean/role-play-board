declare global {
    interface HTMLCanvasElement {
        fillWithColor(color: string): void;
    }
}

HTMLCanvasElement.prototype.fillWithColor = function(color: string) {
    const self = (this as unknown as HTMLCanvasElement);
    const context = self.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, self.width, self.height);
};

export {};
