import { Button, Drawer } from 'antd';

export const ProjectModal = (props: { projectModalOpen: boolean; onClose: () => void }) => {
  return (
    <Drawer width={'100%'} onClose={props.onClose} visible={props.projectModalOpen}>
      <h1>ProjectModal</h1>
      <Button onClick={props.onClose}>关闭</Button>
    </Drawer>
  );
};
