import { Button, Drawer } from 'antd';
import { useProjectModal } from './util';

export const ProjectModal = () => {
  const { projectModalOpen, closeProjectModal } = useProjectModal();
  return (
    <Drawer width={'100%'} onClose={() => closeProjectModal()} visible={projectModalOpen}>
      <h1>ProjectModal</h1>
      <Button onClick={() => closeProjectModal()}>关闭</Button>
    </Drawer>
  );
};
