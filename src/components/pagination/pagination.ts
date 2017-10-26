import { bindable } from 'aurelia-framework'


export class Pagination {

    @bindable totalItems:number;
    @bindable currentPage:number;
    @bindable pageSize:number;
    @bindable maxPageBlocks = 10;
    pages:any; startIdx:number; endIdx:number; totalPages:number;
    prev:number; next:number;
    model:any;


    constructor() {
        this.pages = [];
        this.startIdx = 0;
        this.endIdx = 0;
        this.totalPages = 0;
        this.prev = 0;
        this.next = 0;
    }

    onRefresh(val) {       
        this.model.refresh(val);
    }

    bind(bindingContext) {
        this.model = this.model || bindingContext;
    }

    attached() {
        this.render();
    }

    currentPageChanged() {
        this.render();
    }

    totalItemsChanged(n, o) {
        this.render();
    }

    render() {     
        this.calcTotalPages();
        this.calcPrevValue();
        this.calcNextValue();
        this.calculateStartAndEnd();
        this.pages = [];
        for (let i = this.startIdx; i <= this.endIdx; i++) {            
            this.pages.push({ text: `${i+1}`, value: i });
        }      
    }

    calcTotalPages() {
        let totalPages = Math.floor(this.totalItems / this.pageSize);
        if (this.totalItems % this.pageSize) {
            totalPages++;
        };
        this.totalPages = totalPages;
    }

    calcPrevValue() {      
        if (this.currentPage > 0) {
            this.prev = this.currentPage - 1;
        } else {
            (this.prev = 0)
        }
      
    }

    calcNextValue() {    
        if (this.currentPage < (this.totalPages - 1)) {
            this.next = this.currentPage + 1;
        } else {
            (this.next = this.totalPages - 1)
        }
      
    }

    calculateStartAndEnd() {     
        if (this.isLeftInterval()) {
            this.startIdx = 0;         

        } else if (this.isRightInterval()) {
            this.startIdx = (this.totalPages - this.maxPageBlocks);          
        } else {
            let half = Math.floor(this.maxPageBlocks / 2);         
            this.startIdx = this.currentPage - half;         
        }
        if (this.totalPages <= this.maxPageBlocks)
            this.endIdx = this.totalPages - 1;
        else
            this.endIdx = this.startIdx + (this.maxPageBlocks - 1);         
    }

    isLeftInterval() {
        let half = this.maxPageBlocks / 2;
        return (this.currentPage < half);
    }

    isRightInterval() {
        let half = this.maxPageBlocks / 2;
        let rightIntervalStartIdx = (this.totalPages - 1) - half;
        return (this.currentPage > rightIntervalStartIdx);
    }
}
