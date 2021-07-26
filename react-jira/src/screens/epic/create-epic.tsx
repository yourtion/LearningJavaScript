import styled from '@emotion/styled';
import { Drawer, DrawerProps, Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ErrorBox } from 'components/lib';
import { useEffect } from 'react';
import { useAddEpic } from 'utils/epic';
import { useEpicQueryKey, useProjectIdInUrl } from './util';

export const CreateEpic = (props: Pick<DrawerProps, 'visible'> & { onClose: () => void }) => {
  const projectId = useProjectIdInUrl();
  const { mutate: addEpic, isLoading, error } = useAddEpic(useEpicQueryKey());
  const [form] = useForm();

  const onFinish = async (values: any) => {
    await addEpic({ ...values, projectId });
    props.onClose();
  };

  useEffect(() => {
    form.resetFields();
  }, [form, props.visible]);

  return (
    <Drawer forceRender={true} destroyOnClose={true} width={'100%'} visible={props.visible} onClose={props.onClose}>
      <Container>
        <h1>创建任务组</h1>
        <ErrorBox error={error} />
        <Form form={form} layout={'vertical'} style={{ width: '40rem' }} onFinish={onFinish}>
          <Form.Item label={'名称'} name={'name'} rules={[{ required: true, message: '请输入任务组名' }]}>
            <Input placeholder={'请输入任务组名称'} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button loading={isLoading} type={'primary'} htmlType={'submit'}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Container>
    </Drawer>
  );
};

const Container = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
