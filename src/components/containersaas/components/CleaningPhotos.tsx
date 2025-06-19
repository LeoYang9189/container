import React, { useState } from 'react';
import { Card, Upload, Button, Typography, Modal, Image, Message } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEye } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

interface PhotoItem {
  uid: string;
  name: string;
  url: string;
  type: 'before' | 'after';
  status: 'init' | 'uploading' | 'done' | 'error';
}

interface CleaningPhotosProps {
  workOrderId: string;
  onPhotosChange: (photos: PhotoItem[]) => void;
}

const CleaningPhotos: React.FC<CleaningPhotosProps> = ({
  workOrderId,
  onPhotosChange
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 处理照片上传
  const handleUpload = (file: File, type: 'before' | 'after') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workOrderId', workOrderId);
    formData.append('type', type);

    // 模拟上传
    const uid = Date.now().toString();
    const newPhoto: PhotoItem = {
      uid,
      name: file.name,
      url: URL.createObjectURL(file),
      type,
      status: 'uploading'
    };

    setPhotos(prev => [...prev, newPhoto]);

    // 模拟上传过程
    setTimeout(() => {
      setPhotos(prev => prev.map(photo => 
        photo.uid === uid ? { ...photo, status: 'done' } : photo
      ));
      onPhotosChange(photos);
      Message.success('上传成功');
    }, 1000);

    return false; // 阻止默认上传
  };

  // 删除照片
  const handleDelete = (uid: string) => {
    setPhotos(prev => prev.filter(photo => photo.uid !== uid));
    onPhotosChange(photos.filter(photo => photo.uid !== uid));
  };

  // 预览照片
  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  // 渲染照片列表
  const renderPhotoList = (type: 'before' | 'after') => {
    const typePhotos = photos.filter(photo => photo.type === type);
    const title = type === 'before' ? '清洗前照片' : '清洗后照片';

    return (
      <div className="mb-4">
        <Title heading={6}>{title}</Title>
        <div className="grid grid-cols-4 gap-4">
          {typePhotos.map(photo => (
            <div key={photo.uid} className="relative group">
              <Image
                src={photo.url}
                alt={photo.name}
                className="w-full h-32 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Button
                  type="text"
                  icon={<IconEye />}
                  onClick={() => handlePreview(photo.url)}
                />
                <Button
                  type="text"
                  status="danger"
                  icon={<IconDelete />}
                  onClick={() => handleDelete(photo.uid)}
                />
              </div>
            </div>
          ))}
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => handleUpload(file, type)}
          >
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-primary">
              <IconPlus />
              <Text className="ml-2">上传照片</Text>
            </div>
          </Upload>
        </div>
      </div>
    );
  };

  return (
    <Card title="施工照片" className="mb-4">
      {renderPhotoList('before')}
      {renderPhotoList('after')}

      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default CleaningPhotos; 