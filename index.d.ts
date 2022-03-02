import { SecureContextOptions } from 'tls';
import { ClientRequestArgs } from 'http';
import { Stream } from 'stream';

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

export default function main(urls: string | string[] | { url: string, file: string }, options: Options): Stream;
