import React, { useState } from 'react';
import { Card, Upload, Button, Space, Modal, Message, Progress } from '@arco-design/web-react';
import { IconPlus, IconDelete, IconEye } from '@arco-design/web-react/icon';
import type { UploadItem, UploadProps } from '@arco-design/web-react/es/Upload';

// const { Dragger } = Upload;

export interface PhotoItem {
  uid: string;
  name: string;
  url: string;
  status: 'done' | 'uploading' | 'error';
  category: 'BEFORE' | 'AFTER';
  progress?: number;
}

interface RepairPhotosProps {
  value?: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
}

const RepairPhotos: React.FC<RepairPhotosProps> = ({
  value,
  onChange
}) => {
  const [photos, setPhotos] = useState<PhotoItem[]>(value || []);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // 上传前检查
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      Message.error('只能上传图片文件！');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      Message.error('图片大小不能超过 5MB！');
      return false;
    }
    return true;
  };

  // 处理上传
  const handleUpload = async (file: File) => {
    const newPhoto: PhotoItem = {
      uid: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      status: 'uploading',
      category: 'BEFORE',
      progress: 0
    };

    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    onChange(newPhotos);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
        }));
      }, 200);

      // TODO: 替换为实际的上传 API
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(progressInterval);

      // 模拟上传成功
      const url = URL.createObjectURL(file);
      const newPhotos = [...photos, {
        uid: Date.now().toString(),
        name: file.name,
        status: 'done' as const,
        url,
        type: file.type,
        size: file.size,
        category: 'BEFORE' as const,
        progress: 100
      }];

      setPhotos(newPhotos);
      onChange(newPhotos);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 100
      }));

      Message.success('上传成功');
    } catch (error) {
      Message.error('上传失败');
    }
  };

  const handleUploadSuccess = (uid: string, url: string) => {
    const newPhotos = photos.map(photo => {
      if (photo.uid === uid) {
        return {
          ...photo,
          url,
          status: 'done' as const,
          progress: 100
        };
      }
      return photo;
    });
    setPhotos(newPhotos);
    onChange(newPhotos);
  };

  const handleUploadError = (uid: string) => {
    const newPhotos = photos.map(photo => {
      if (photo.uid === uid) {
        return {
          ...photo,
          status: 'error' as const
        };
      }
      return photo;
    });
    setPhotos(newPhotos);
    onChange(newPhotos);
  };

  // 预览照片
  const handlePreview = (file: UploadItem) => {
    setPreviewImage(file.url || '');
    setPreviewVisible(true);
  };

  // 删除照片
  const handleRemove = (uid: string) => {
    const newPhotos = photos.filter(photo => photo.uid !== uid);
    setPhotos(newPhotos);
    onChange(newPhotos);
    Message.success('删除成功');
  };

  // 更新照片类别
  const handleCategoryChange = (uid: string, category: 'BEFORE' | 'AFTER') => {
    const newPhotos = photos.map(photo => {
      if (photo.uid === uid) {
        return { ...photo, category };
      }
      return photo;
    });
    setPhotos(newPhotos);
    onChange(newPhotos);
  };

  // 上传组件配置
  const uploadProps: UploadProps = {
    customRequest: ({ file }: { file: File }) => handleUpload(file),
    beforeUpload,
    showUploadList: false,
    multiple: true,
    drag: true // 启用拖拽上传
  };

  // 渲染照片列表
  const renderPhotoList = () => {
    const beforePhotos = photos.filter(photo => photo.category === 'BEFORE');
    const afterPhotos = photos.filter(photo => photo.category === 'AFTER');

    return (
      <div className="space-y-6">
        {/* 施工前照片 */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">施工前照片</h3>
            <p className="text-gray-500 text-sm">上传施工前的照片，记录集装箱原始状态</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {beforePhotos.map(photo => (
              <div key={photo.uid} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    type="text"
                    icon={<IconEye />}
                    onClick={() => handlePreview(photo)}
                    className="text-white"
                  />
                  <Button
                    type="text"
                    icon={<IconDelete />}
                    onClick={() => handleRemove(photo.uid)}
                    className="text-white"
                  />
                </div>
                {uploadProgress[photo.name] !== undefined && uploadProgress[photo.name] < 100 && (
                  <Progress
                    percent={uploadProgress[photo.name]}
                    size="small"
                    className="absolute bottom-0 left-0 right-0"
                  />
                )}
              </div>
            ))}
            <Upload {...uploadProps} className="h-32">
              <div className="flex flex-col items-center justify-center h-full">
                <IconPlus className="text-2xl mb-2" />
                <div>点击或拖拽上传</div>
              </div>
            </Upload>
          </div>
        </div>

        {/* 施工后照片 */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">施工后照片</h3>
            <p className="text-gray-500 text-sm">上传施工后的照片，记录集装箱修复状态</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {afterPhotos.map(photo => (
              <div key={photo.uid} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <Button
                    type="text"
                    icon={<IconEye />}
                    onClick={() => handlePreview(photo)}
                    className="text-white"
                  />
                  <Button
                    type="text"
                    icon={<IconDelete />}
                    onClick={() => handleRemove(photo.uid)}
                    className="text-white"
                  />
                </div>
                {uploadProgress[photo.name] !== undefined && uploadProgress[photo.name] < 100 && (
                  <Progress
                    percent={uploadProgress[photo.name]}
                    size="small"
                    className="absolute bottom-0 left-0 right-0"
                  />
                )}
              </div>
            ))}
            <Upload {...uploadProps} className="h-32">
              <div className="flex flex-col items-center justify-center h-full">
                <IconPlus className="text-2xl mb-2" />
                <div>点击或拖拽上传</div>
              </div>
            </Upload>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card title="施工照片">
      {renderPhotoList()}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        className="max-w-4xl"
      >
        <img
          src={previewImage}
          alt="预览"
          className="w-full h-auto"
          style={{ maxHeight: '80vh' }}
        />
      </Modal>
    </Card>
  );
};

export default RepairPhotos; 