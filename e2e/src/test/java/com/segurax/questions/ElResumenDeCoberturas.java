package com.segurax.questions;

import com.segurax.targets.CoverageTargets;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Question para obtener valores del resumen de coberturas.
 *
 * @author QA Team - ASDD
 * @version 1.0.0
 * @see Question
 */
public class ElResumenDeCoberturas implements Question<Integer> {

    private String tipo;

    private ElResumenDeCoberturas() {
    }

    public static ElResumenDeCoberturas obligatorias() {
        ElResumenDeCoberturas q = new ElResumenDeCoberturas();
        q.tipo = "obligatorias";
        return q;
    }

    public static ElResumenDeCoberturas opcionales() {
        ElResumenDeCoberturas q = new ElResumenDeCoberturas();
        q.tipo = "opcionales";
        return q;
    }

    public static ElResumenDeCoberturas total() {
        ElResumenDeCoberturas q = new ElResumenDeCoberturas();
        q.tipo = "total";
        return q;
    }

    @Override
    public Integer answeredBy(Actor actor) {
        String texto;
        switch (tipo) {
            case "obligatorias":
                texto = Text.of(CoverageTargets.CONTADOR_OBLIGATORIAS).answeredBy(actor);
                break;
            case "opcionales":
                texto = Text.of(CoverageTargets.CONTADOR_OPCIONALES).answeredBy(actor);
                break;
            case "total":
                texto = Text.of(CoverageTargets.CONTADOR_TOTAL_COBERTURAS).answeredBy(actor);
                break;
            default:
                return 0;
        }

        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
