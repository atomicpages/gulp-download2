import { SecureContextOptions } from 'tls';
import { ClientRequestArgs } from 'http';

export type Options = SecureContextOptions &
    Pick<
        ClientRequestArgs,
        'method' | 'agent' | 'auth' | 'timeout' | 'headers' | 'localAddress'
    > & {
        /**
         * Customize error handling when a resource cannot be downloaded.
         */
        errorCallback?: (code: number) => void;

        /**
         * Override `is-ci` by setting status yourself.
         */
        ci?: boolean;
    };

export default function main(urls: string | string[], options: Options): void;
