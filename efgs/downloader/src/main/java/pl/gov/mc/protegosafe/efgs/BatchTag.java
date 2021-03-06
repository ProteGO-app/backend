package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Getter
@AllArgsConstructor
public class BatchTag {

    public static final BatchTag EMPTY = new BatchTag(null, 0);

    String batchTag;
    int offset;

    BatchTag(String batchTag) {
        this.batchTag = batchTag;
        this.offset = 0;
    }

    boolean isEmpty() {
        return batchTag == null;
    }
}
