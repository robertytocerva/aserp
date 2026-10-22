package cxt.robertytocerva.aserp.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ImagenEvidenciaValidatorTest {

    @Test
    void reconoceJpegPorFirmaBinaria() {
        byte[] jpeg = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0x10};
        assertEquals("image/jpeg", ImagenEvidenciaValidator.tipoMime(jpeg));
    }

    @Test
    void reconocePngPorFirmaBinaria() {
        byte[] png = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0};
        assertEquals("image/png", ImagenEvidenciaValidator.tipoMime(png));
    }

    @Test
    void rechazaTextoAunqueTengaExtensionDeImagen() {
        byte[] texto = "no soy una imagen".getBytes();
        assertNull(ImagenEvidenciaValidator.tipoMime(texto));
    }

    @Test
    void rechazaArchivoVacioONulo() {
        assertNull(ImagenEvidenciaValidator.tipoMime(new byte[0]));
        assertNull(ImagenEvidenciaValidator.tipoMime(null));
    }
}
