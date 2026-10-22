package cxt.robertytocerva.aserp.service;

public final class ImagenEvidenciaValidator {

    public static final long MAX_BYTES = 2L * 1024 * 1024;

    private static final byte[] JPEG_MAGIC = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_MAGIC = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};

    private ImagenEvidenciaValidator() {}

    /** Devuelve el tipo MIME si los bytes son JPG o PNG reales (firma binaria), o null en otro caso. */
    public static String tipoMime(byte[] datos) {
        if (empiezaCon(datos, JPEG_MAGIC)) {
            return "image/jpeg";
        }
        if (empiezaCon(datos, PNG_MAGIC)) {
            return "image/png";
        }
        return null;
    }

    private static boolean empiezaCon(byte[] datos, byte[] firma) {
        if (datos == null || datos.length < firma.length) {
            return false;
        }
        for (int i = 0; i < firma.length; i++) {
            if (datos[i] != firma[i]) {
                return false;
            }
        }
        return true;
    }
}
