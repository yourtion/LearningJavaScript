import { Modal, Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { TaskTypeSelect } from 'components/select-task-type';
import { UserSelect } from 'components/select-user';
import { useEffect } from 'react';
import { useDeleteTasks, useEditTask } from 'utils/task';
import { useTasksModal, useTasksQueryKey } from './util';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTask, editingTaskId, closeEdit } = useTasksModal();
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(useTasksQueryKey());
  const { mutateAsync: deleteTask } = useDeleteTasks(useTasksQueryKey());

  const onCancle = () => {
    closeEdit();
    form.resetFields();
  };
  const onOk = async () => {
    closeEdit();
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    form.resetFields();
  };
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);

  const startDeleteTask = () => {
    closeEdit();
    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      title: `确定删除任务么？`,
      onOk() {
        return deleteTask({ id: Number(editingTaskId) });
      },
    });
  };

  return (
    <Modal
      forceRender={true}
      okText={'确认'}
      cancelText={'取消'}
      onCancel={onCancle}
      onOk={onOk}
      confirmLoading={editLoading}
      title={'编辑任务'}
      visible={!!editingTaskId}
    >
      <Form {...layout} initialValues={editingTask} form={form}>
        <Form.Item label={'任务名'} name={'name'} rules={[{ required: true, message: '请输入任务名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'经办人'} name={'processorId'}>
          <UserSelect defaultOptionName={'经办人'} />
        </Form.Item>
        <Form.Item label={'类型'} name={'typeId'}>
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'right' }}>
        <Button style={{ fontSize: '14px' }} size={'small'} onClick={startDeleteTask}>
          删除
        </Button>
      </div>
    </Modal>
  );
};
