import {
 SSEStatusEvent,
 SSEDebugEvent,
 SSESpecEvent,
 SSESpecChunkEvent,
 SSECompleteEvent,
 SSEErrorEvent,
 PipelineStage,
 UISpec
} from './types';

export class SSEStreamer {
 public stream: ReadableStream;
 private controller!: ReadableStreamDefaultController;
 private encoder = new TextEncoder();

 constructor() {
 this.stream = new ReadableStream({
 start: (controller) => {
 this.controller = controller;
 }
 });
 }

 private sendEvent(event: string, data: any) {
 if (!this.controller) return;
 const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
 this.controller.enqueue(this.encoder.encode(msg));
 }

 status(stage: PipelineStage, message: string) {
 const payload: SSEStatusEvent = { stage, message };
 this.sendEvent('status', payload);
 }

 debug(stage: PipelineStage, data: any) {
 const payload: SSEDebugEvent = { stage, data };
 this.sendEvent('debug', payload);
 }

 specUpdate(blocks: number, total: number) {
 const payload: SSESpecEvent = { type: 'partial', blocks, total };
 this.sendEvent('spec', payload);
 }

 specChunk(partial: string) {
 const payload: SSESpecChunkEvent = { type: 'spec-chunk', partial };
 this.sendEvent('spec-chunk', payload);
 }

 complete(uiSpec: UISpec) {
 const payload: SSECompleteEvent = { uiSpec };
 this.sendEvent('complete', payload);
 this.close();
 }

 error(message: string, code: string) {
 const payload: SSEErrorEvent = { message, code };
 this.sendEvent('error', payload);
 this.close();
 }

 close() {
 if (this.controller) {
 try {
 this.controller.close();
 } catch (e) {
 // Ignore
 }
 }
 }
}
