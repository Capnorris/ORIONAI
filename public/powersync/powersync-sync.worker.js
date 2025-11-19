import { createBaseLogger } from '@powersync/common';
import { SharedSyncImplementation } from './SharedSyncImplementation';
import { WorkerClient } from './WorkerClient';
const _self = self;
const logger = createBaseLogger();
logger.useDefaults();
const sharedSyncImplementation = new SharedSyncImplementation();
_self.onconnect = async function (event) {
    const port = event.ports[0];
    await new WorkerClient(sharedSyncImplementation, port).initialize();
};
