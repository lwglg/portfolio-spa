/**
 * Composition root — Cloudflare Worker entrypoint (DDD + path aliases).
 *
 * Aliases: @domain | @application | @infrastructure | @interfaces | @portfolio
 */
import { ContactHttpController } from '@interfaces/http/ContactHttpController';
import type { WorkerEnv } from '@interfaces/http/Env';

const controller = new ContactHttpController();

const worker = {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return controller.handle(request, env);
  },
};

export default worker;
