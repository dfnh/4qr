import { useFormContext } from 'react-hook-form';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';

export const useFormContextQr = useFormContext<QrFullSchema>;
