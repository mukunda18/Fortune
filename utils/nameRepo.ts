const remainingNameRepo = new Set<string>([
    "ShadowVex",
    "NeonRaptor",
    "VoidStrike",
    "FrostByte",
    "DarkPulse",
    "EmberKnight",
    "RuneWarden",
    "NightDrake",
    "NovaCore",
    "PixelPhantom",
    "QuantumZed",
    "Zynx",
    "Nox",
    "Raze",
    "LagWizard"
]);
const usedNameRepo = new Set<string>();


export const getName = () => {
    const randomElement = [...remainingNameRepo][Math.floor(Math.random() * remainingNameRepo.size)];
    usedNameRepo.add(randomElement);
    remainingNameRepo.delete(randomElement);
    return randomElement;
}

export const putName = (name: string) => {
    if (!usedNameRepo.has(name)) return;
    remainingNameRepo.add(name);
    usedNameRepo.delete(name);
}