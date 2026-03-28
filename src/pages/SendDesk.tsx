import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Wand2, Send } from 'lucide-react';
import { SendDeskTemplates } from '@/components/senddesk/SendDeskTemplates';
import { SendDeskGenerator } from '@/components/senddesk/SendDeskGenerator';
import { SendDeskSendShare } from '@/components/senddesk/SendDeskSendShare';

export default function SendDesk() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SendDesk</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Centralized hub for creating, generating, and sending HR documents & communications
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border/50">
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="generator" className="gap-2">
            <Wand2 className="h-4 w-4" /> Document Generator
          </TabsTrigger>
          <TabsTrigger value="send" className="gap-2">
            <Send className="h-4 w-4" /> Send & Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <SendDeskTemplates />
        </TabsContent>

        <TabsContent value="generator">
          <SendDeskGenerator />
        </TabsContent>

        <TabsContent value="send">
          <SendDeskSendShare />
        </TabsContent>
      </Tabs>
    </div>
  );
}
