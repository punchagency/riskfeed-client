import { PageHeader } from '@/components/page-header';
import { Plus } from 'lucide-react';
import React from 'react';

const Messages: React.FC = () => {
  return (
    <>
      <PageHeader 
        title='Messages'
        description='Communicate with your contractors'
        ActionIcon={Plus}
        actionText='New Group Message'
        onAction={() => { }}
      />
    </>
  )
}

export default Messages
