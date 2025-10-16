import { AudioSpectrumAnalogWidget, AudioSpectrumCircleWidget, AudioSpectrumTopDownWidget } from "@/widgets";

export default function Audio() {
  return (
    <>
      <AudioSpectrumTopDownWidget />
      <AudioSpectrumCircleWidget />
      <AudioSpectrumAnalogWidget />
    </>
  );
}
