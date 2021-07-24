import React, { ProfilerOnRenderCallback, ProfilerProps } from 'react';

let QUEUE: unknown[] = [];
function sendQueuedProfiles() {
  if (QUEUE.length < 1) {
    return;
  }
  const dataToSend = [...QUEUE];
  QUEUE = [];
  console.log(dataToSend);
}
setInterval(sendQueuedProfiles, 5000);

type Props = { metadata?: any; phases?: ('mount' | 'update')[] } & Omit<ProfilerProps, 'onRender'>;
export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!phases || phases.includes(phase)) {
      QUEUE.push({ id, phase, actualDuration, baseDuration, startTime, commitTime, interactions, metadata });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
